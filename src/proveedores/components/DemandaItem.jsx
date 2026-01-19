import { View, Image, StyleSheet, TouchableOpacity } from "react-native";
import { AuthContext } from "../../auth/context/AuthContext";
import theme from "../../theme";
import ProgressBar from "react-native-progress/Bar";
import StyledText from "../../styles/StyledText";
import { apiUrl } from "../../../apiUrl";
import React, { useState, useEffect, useContext } from "react";
import { dateOptions } from "../../components/dateOptions";
import { EtiquetaEstadoOferta } from "../../components/EtiquetaEstadoOferta";
import Icon from "react-native-ico-material-design";
import { DetalleProductoC } from "./DetalleProductoC";

const DemandaItem = (props) => {
  const [isvisible, setisvisible] = useState(false);
  const [producto, setProducto] = useState();
  const [comprador, setComprador] = useState();
  const [estadoDemanda, setEstadoDemanda] = useState();
  const [nombreComprador, setNombreComprador] = useState();
  const [datosProd, setDatosProd] = useState({});
  const [progresoDemanda, setProgresoDemanda] = useState(0);
  const fechaLimiteObj = new Date(props.FechaLimite);
  const { authState } = useContext(AuthContext);

  let maximo;
  let actualProductos;

  const updateProgresoDemanda = () => {
    maximo = parseInt(props.Maximo);
    actualProductos = parseInt(props.ActualProductos);
    setProgresoDemanda(actualProductos / maximo);
  };

  const getProductoDemanda = async () => {
    const resp = await globalThis.fetch(
      `${apiUrl}/productos?id=${props.IdProducto}`
    );
    const data = await resp.json();
    const { rows: producto } = !!data && data;
    setProducto(producto[0]);
  };
  const getCompradorDemanda = async () => {
    const resp = await globalThis.fetch(
      `${apiUrl}/usuarios?idUsuario=${props.IdComprador}`
    );
    const data = await resp.json();
    const { rows: comprador } = !!data && data;
    setComprador(comprador[0]);
  };
  const getEstadoDemanda = async () => {
    const resp = await globalThis.fetch(
      `${apiUrl}/estados?id=${props.IdEstadosOferta}`
    );
    const data = await resp.json();
    const { rows: estado } = !!data && data;
    setEstadoDemanda(estado[0]);
  };
  useEffect(() => {
    getProductoDemanda();
    getCompradorDemanda();
    getEstadoDemanda();
    updateProgresoDemanda();
    // checkEstaUnidoDemanda();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props]);

  useEffect(() => {
    setNombreComprador(comprador?.Nombre);
  }, [comprador]);

  useEffect(() => {
    setDatosProd({
      nombreProd: producto?.Name,
      precioMin: props.PrecioMinimo,
      precioMax: props.PrecioMaximo,
      urlImg: producto?.UrlImg,
    });
  }, [producto, props]);

  return (
    <TouchableOpacity
      testID="demandaItemRoot"
      style={styles.cardContainer}
      activeOpacity={0.9}
      onPress={() => setisvisible(true)}
    >
      {/* Imagen del producto */}
      <View style={styles.imageSection}>
        <Image
          source={
            datosProd?.urlImg != null && datosProd?.urlImg != "no-img.jpeg"
              ? {
                  uri: datosProd?.urlImg,
                }
              : require("../../../public/no-img.jpeg")
          }
          style={styles.productImage}
        />
      </View>

      {/* Contenido de la tarjeta */}
      <View style={styles.contentSection}>
        {/* Header con etiqueta de estado */}
        <View style={styles.headerRow}>
          {estadoDemanda?.Descripcion === "Cerrado" ? (
            <EtiquetaEstadoOferta estado="Verificando pagos" />
          ) : (
            <EtiquetaEstadoOferta estado={estadoDemanda?.Descripcion} />
          )}
        </View>

        {/* Título del producto y comprador */}
        <View style={styles.titleSection}>
          <StyledText style={styles.productTitle} numberOfLines={2}>
            {datosProd?.nombreProd}
          </StyledText>
          <View style={styles.buyerInfo}>
            <StyledText style={styles.buyerName}>{nombreComprador}</StyledText>
          </View>
        </View>

        {/* Información de demanda y progreso */}
        <View style={styles.demandInfo}>
          <StyledText style={styles.infoLabel}>
            Se demanda: <StyledText style={styles.infoValue}>{props.Maximo}</StyledText>
          </StyledText>
          <StyledText style={styles.infoLabel}>
            Actual: <StyledText style={styles.infoValue}>{parseInt(props.ActualProductos)} / {props.Maximo}</StyledText>
          </StyledText>
          <View style={styles.progressContainer}>
            <ProgressBar
              progress={progresoDemanda}
              width={null}
              height={6}
              color="#10b981"
              unfilledColor="#e5e7eb"
              borderWidth={0}
              borderRadius={3}
              style={styles.progressBar}
            />
          </View>
          <StyledText style={styles.infoLabel}>
            Fecha vigencia: <StyledText style={styles.infoValue}>{fechaLimiteObj.toLocaleDateString()}</StyledText>
          </StyledText>
        </View>

        {/* Precios destacados */}
        <View style={styles.pricesSection}>
          <View style={styles.priceBox}>
            <StyledText style={styles.priceLabel}>Precio Mínimo</StyledText>
            <StyledText style={styles.priceValue}>${datosProd?.precioMin}</StyledText>
          </View>
          <View style={styles.priceBox}>
            <StyledText style={styles.priceLabel}>Precio Máximo</StyledText>
            <StyledText style={styles.priceValue}>${datosProd?.precioMax}</StyledText>
          </View>
        </View>

        {/* Botón de acción */}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => setisvisible(true)}
          activeOpacity={0.8}
        >
          <StyledText style={styles.actionButtonText}>CREAR PROPUESTA</StyledText>
        </TouchableOpacity>
      </View>

      <DetalleProductoC
        isvisible={isvisible}
        onclose={() => setisvisible(false)}
        dataproducto={{
          props,
          producto,
          comprador,
          estadoDemanda,
          nombreComprador,
          datosProd,
          progresoDemanda,
          fechaLimiteObj,
          Maximo: parseInt(props.Maximo),
          Minimo: parseInt(props.Minimo),
          actualProductos: parseInt(props.ActualProductos),
          IdDemanda: props.IdDemanda,
          IdUsuario: authState.user.IdUsuario,
        }}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 2,
  },
  imageSection: {
    width: "100%",
    height: 180,
    backgroundColor: "#f9fafb",
  },
  productImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  contentSection: {
    padding: 16,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: 12,
  },
  titleSection: {
    marginBottom: 12,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
    lineHeight: 22,
  },
  buyerInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  buyerName: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "400",
  },
  demandInfo: {
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 4,
    fontWeight: "400",
  },
  infoValue: {
    fontWeight: "600",
    color: "#111827",
  },
  progressContainer: {
    marginVertical: 8,
  },
  progressBar: {
    width: "100%",
  },
  pricesSection: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  priceBox: {
    flex: 1,
    backgroundColor: "#f9fafb",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  priceLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 4,
    fontWeight: "500",
  },
  priceValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2563eb",
  },
  actionButton: {
    backgroundColor: "#2563eb",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#2563eb",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 0.5,
  },
});

export default DemandaItem;
