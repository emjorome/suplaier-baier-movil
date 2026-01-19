import React, { useEffect, useMemo, useState, useContext } from "react";
import { View, Image, StyleSheet, TouchableOpacity } from "react-native";
import { AuthContext } from "../../auth/context/AuthContext";
import theme from "../../theme";
import ProgressBar from "react-native-progress/Bar";
import StyledText from "../../styles/StyledText";
import { apiUrl } from "../../../apiUrl";
import { dateOptions } from "../../components/dateOptions";
import { EtiquetaEstadoOferta } from "../../components/EtiquetaEstadoOferta";
import { DetalleProductoC } from "./DetalleProductoC";

const OfertaItem = (props) => {
  const [isvisible, setisvisible] = useState(false);
  const [producto, setProducto] = useState(null);
  const [proveedor, setProveedor] = useState(null);
  const [estadoOferta, setEstadoOferta] = useState(null);
  const [estaUnido, setEstaUnido] = useState(false);
  const { authState } = useContext(AuthContext);

  const fechaLimiteObj = useMemo(() => {
    const d = new Date(props?.FechaLimite ?? "");
    return isNaN(d.getTime()) ? new Date() : d;
  }, [props?.FechaLimite]);

  const maximo = useMemo(() => Number(props?.Maximo ?? 0) || 0, [props?.Maximo]);
  const actualProductos = useMemo(
    () => Number(props?.ActualProductos ?? 0) || 0,
    [props?.ActualProductos]
  );

  const progresoOferta = useMemo(() => {
    if (maximo <= 0) return 0;
    const p = actualProductos / maximo;
    if (!Number.isFinite(p)) return 0;
    return Math.min(Math.max(p, 0), 1);
  }, [actualProductos, maximo]);

  const datosProd = useMemo(() => {
    const costoU = Number(props?.ValorUProducto ?? 0) || 0;
    const costoInst = Number(props?.ValorUInstantaneo ?? 0) || 0;

    return {
      nombreProd: producto?.Name ?? "",
      costoU,
      costoInst,
      urlImg: producto?.UrlImg ?? null,
      // por si luego lo usas en DetalleProductoC:
      Descripcion: producto?.Descripcion ?? producto?.Description ?? "",
      Valoracion: producto?.Valoracion ?? producto?.Rating ?? 1,
    };
  }, [producto, props?.ValorUProducto, props?.ValorUInstantaneo]);

  const nombreProveedor = useMemo(() => proveedor?.Nombre ?? "", [proveedor]);

  const checkEstaUnidoOferta = async () => {
    try {
      const idComprador = authState?.user?.IdUsuario;
      if (!idComprador || !props?.IdOferta) return;

      const resp = await globalThis.fetch(
        `${apiUrl}/compras/estaUnido?idOferta=${props.IdOferta}&idComprador=${idComprador}`
      );

      const data = await resp.json();
      const filas = data?.rows ?? [];
      const countRaw = filas?.[0]?.["COUNT (*)"];

      if (Number(countRaw) === 1) setEstaUnido(true);
      else setEstaUnido(false);
    } catch (e) {
      // si falla, no rompas UI
      setEstaUnido(false);
    }
  };

  const getProductoOferta = async () => {
    try {
      if (!props?.IdProducto) return;
      const resp = await globalThis.fetch(`${apiUrl}/productos?id=${props.IdProducto}`);
      const data = await resp.json();
      const rows = data?.rows ?? [];
      setProducto(rows[0] ?? null);
    } catch (e) {
      setProducto(null);
    }
  };

  const getProveedorOferta = async () => {
    try {
      if (!props?.IdProveedor) return;
      const resp = await globalThis.fetch(
        `${apiUrl}/usuarios?idUsuario=${props.IdProveedor}`
      );
      const data = await resp.json();
      const rows = data?.rows ?? [];
      setProveedor(rows[0] ?? null);
    } catch (e) {
      setProveedor(null);
    }
  };

  const getEstadoOferta = async () => {
    try {
      if (!props?.IdEstadosOferta) return;
      const resp = await globalThis.fetch(`${apiUrl}/estados?id=${props.IdEstadosOferta}`);
      const data = await resp.json();
      const rows = data?.rows ?? [];
      setEstadoOferta(rows[0] ?? null);
    } catch (e) {
      setEstadoOferta(null);
    }
  };

  useEffect(() => {
    // Cargar datos al montar / cuando cambia oferta
    getProductoOferta();
    getProveedorOferta();
    getEstadoOferta();
    checkEstaUnidoOferta();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props?.IdOferta, props?.IdProducto, props?.IdProveedor, props?.IdEstadosOferta]);

  const unidadesRestantes = useMemo(() => {
    const r = maximo - actualProductos;
    return r < 0 ? 0 : r;
  }, [maximo, actualProductos]);

  const openDetalle = () => setisvisible(true);

  return (
    <>
      {/* ✅ TODA LA TARJETA ES CLICKEABLE (como en la web) */}
      <TouchableOpacity
        activeOpacity={0.9}
        style={styles.ofertaContainer}
        onPress={openDetalle}
      >
        <View style={styles.textoImagenContainer}>
          <StyledText
            style={styles.textTitulo}
            fontWeight="bold"
            fontSize="subtitle"
            color="purple"
          >
            {datosProd?.nombreProd}
          </StyledText>

          <Image
            source={
              datosProd?.urlImg != null && datosProd?.urlImg !== "no-img.jpeg"
                ? { uri: datosProd?.urlImg }
                : require("../../../public/no-img.jpeg")
            }
            style={styles.imageContainer}
          />

          <StyledText color="purple">{nombreProveedor}</StyledText>
        </View>

        <View style={styles.enOfertaContainer}>
          <View style={styles.textoEnOfertaContainer}>
            <StyledText color="purple" fontWeight="bold">
              En oferta:{" "}
            </StyledText>
            <StyledText color="purple">{unidadesRestantes}/</StyledText>
            <StyledText color="purple">{maximo}</StyledText>
          </View>

          {estaUnido && <EtiquetaEstadoOferta estado="Unido" />}
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <ProgressBar
              progress={progresoOferta}
              width={200}
              height={25}
              color={theme.colors.blue}
              unfilledColor={theme.colors.gray2}
            />
          </View>
        </View>

        <View style={styles.provEstadoContainer}>
          <View style={styles.precioUContainer}>
            <StyledText color="purple" fontWeight="bold">
              Precio unitario:{" "}
            </StyledText>
            <StyledText color="purple">{datosProd?.costoU}$</StyledText>
          </View>

          {estadoOferta?.Descripcion === "Cerrado" ? (
            <EtiquetaEstadoOferta estado="Verificando pagos" />
          ) : (
            <EtiquetaEstadoOferta estado={estadoOferta?.Descripcion} />
          )}
        </View>

        <View style={styles.provDetalleContainer}>
          <View style={styles.precioInstContainer}>
            <StyledText color="purple" fontWeight="bold">
              Precio instantáneo:{" "}
            </StyledText>
            <StyledText color="purple">
              {Number(datosProd?.costoInst ?? 0) === 0 ? "--" : `${datosProd?.costoInst}$`}
            </StyledText>
          </View>

          {/* ✅ Botón opcional (si lo tocas también abre) */}
          <TouchableOpacity style={styles.detalleContainer} onPress={openDetalle}>
            <StyledText color="secondary">Detalle</StyledText>
          </TouchableOpacity>
        </View>

        <View style={styles.vigenciaContainer}>
          <StyledText color="purple" fontWeight="bold">
            Fecha vigencia:{" "}
          </StyledText>
          <StyledText color="purple">
            {fechaLimiteObj.toLocaleString(undefined, dateOptions)}
          </StyledText>
        </View>
      </TouchableOpacity>

      {isvisible && (
        <DetalleProductoC
          isvisible={isvisible}
          onclose={() => setisvisible(false)}
          dataproducto={{
            props, // oferta raw
            producto,
            proveedor,
            estadoOferta,
            nombreProveedor,
            datosProd,
            progresoOferta,
            fechaLimiteObj,
            Maximo: maximo,
            Minimo: Number(props?.Minimo ?? 0) || 0,
            actualProductos: actualProductos,
            IdOferta: props?.IdOferta,
            IdUsuario: authState?.user?.IdUsuario,
            estaUnido,
          }}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  ofertaContainer: {
    borderWidth: 1,
    borderRadius: 4,
    borderColor: theme.colors.lightGray2,
    marginBottom: 10,
    padding: 10,
  },
  textTitulo: {
    textAlign: "center",
  },
  textoImagenContainer: {
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },
  imageContainer: {
    width: 210,
    height: 210,
    resizeMode: "contain",
  },
  provEstadoContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  provDetalleContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 7,
  },
  enOfertaContainer: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  textoEnOfertaContainer: {
    alignItems: "flex-start",
    flexDirection: "row",
  },
  precioUContainer: {
    flexDirection: "row",
  },
  precioInstContainer: {
    flexDirection: "row",
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 5,
  },
  progressBar: {
    marginRight: 2,
  },
  vigenciaContainer: {
    alignItems: "flex-start",
    flexDirection: "row",
    marginTop: 12,
  },
  detalleContainer: {
    backgroundColor: theme.colors.blue,
    padding: 5,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
  },
});

export default OfertaItem;
