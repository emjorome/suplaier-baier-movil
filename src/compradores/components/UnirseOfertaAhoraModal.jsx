/* eslint-disable no-sequences */
import React, { useState, useContext } from "react";
import {
  Modal,
  Image,
  Text,
  View,
  StyleSheet,
  Button,
  Alert,
  ScrollView,
} from "react-native";
import { ButtonWithText } from "../../proveedores/components/ButtonWithText";
import StyledText from "../../styles/StyledText";
import theme from "../../theme";
import { dateOptions } from "../../components/dateOptions";
import { apiUrl } from "../../../apiUrl";
import { useData } from "../../hooks/OfertasDataProvider";
import { AuthContext } from "../../auth/context/AuthContext";
import { useDescuentos } from "../hooks/DescuentosDataProvider";
import { useRecompensas } from "../../hooks/RecompensasDataProvider";
import { SelectorDescuento } from "../../components/SelectorDescuento";

export const UnirseOfertaAhoraModal = ({
  dataproducto,
  isvisibleUnirseOfertaAhoraModal,
  oncloseUnirseOfertaAhora,
  oncloseexito,
}) => {
  const { authState } = useContext(AuthContext);
  const { descuentos, refreshDescuentos } = useDescuentos();
  const { balance: saldoEstrellas, refreshBalance } = useRecompensas();
  const { getOfertasTodos } = useData();

  const fechaLimiteObj = new Date(dataproducto?.fechaLimiteObj ?? "");
  const [contador, setContador] = useState(0);
  const [descuentoSeleccionado, setDescuentoSeleccionado] = useState(null);
  const [disabled, setDisabled] = useState(false);

  const unidadesdisponibles =
    parseInt(dataproducto?.Maximo) - parseInt(dataproducto?.actualProductos);

  // Calcular subtotal
  const calcularSubtotal = () => {
    return contador * (dataproducto?.datosProd?.costoInst || 0);
  };

  // Calcular descuento
  const calcularDescuento = () => {
    if (!descuentoSeleccionado) return 0;
    
    const subtotal = calcularSubtotal();
    const porcentaje = descuentoSeleccionado.PorcentajeDescuento || descuentoSeleccionado.Porcentaje || 0;
    
    return subtotal * (porcentaje / 100);
  };

  // Calcular total
  const calcularTotal = () => {
    return Math.max(0, calcularSubtotal() - calcularDescuento());
  };

  // Validar descuento
  const handleSelectDescuento = (desc) => {
    if (!desc) {
      setDescuentoSeleccionado(null);
      return;
    }

    const costoEstrellas = desc.CostoEstrellas || 0;
    
    if (saldoEstrellas < costoEstrellas) {
      Alert.alert(
        'Estrellas insuficientes',
        `Necesitas ${costoEstrellas} estrellas. Tu saldo: ${saldoEstrellas}⭐`
      );
      return;
    }

    setDescuentoSeleccionado(desc);
  };

  const incrementarContador = () => {
    if (contador < unidadesdisponibles) {
      setContador(contador + 1);
    }
  };

  const decrementarContador = () => {
    if (contador > 0) {
      setContador(contador - 1);
    }
  };

  const crearCompraIndividual = async () => {
    const body = {
      IdComprador: dataproducto.IdUsuario,
      IdProveedor: dataproducto.proveedor.IdUsuario,
      IdOferta: dataproducto.IdOferta,
      Cantidad: contador,
      Total: calcularTotal(),
      TipoCompra: "instantanea",
      Descripcion: "",
      Observacion: "",
      IdEstado: dataproducto.estadoOferta.IdEstadosOferta,
      MetodoPago: "reserva",
      PagadoAProveedor: false,
      IdOpcionDescuento: descuentoSeleccionado?.IdOpcion || null,
    };

    await fetch(`${apiUrl}/compras`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("La solicitud no fue exitosa");
        }
        
        // Refrescar datos
        getOfertasTodos();
        refreshDescuentos();
        refreshBalance();

        Alert.alert(
          "¡Éxito!",
          "La compra instantánea se ha realizado con éxito",
          [
            {
              text: "Aceptar",
              onPress: () => {
                setDisabled(false);
                setContador(0);
                setDescuentoSeleccionado(null);
                oncloseexito();
              },
            },
          ],
          { cancelable: false }
        );
      })
      .catch(() => {
        Alert.alert(
          "Error en la oferta",
          "Ha habido un error al intentar crear la orden de compra",
          [
            {
              text: "Aceptar",
              onPress: () => {
                setDisabled(false);
                oncloseexito();
              },
            },
          ],
          { cancelable: false }
        );
      });
  };

  const pagarahora = async () => {
    if (contador === 0) {
      Alert.alert("Error", "Debes seleccionar al menos una unidad");
      return;
    }

    setDisabled(true);

    const body = {
      IdOferta: dataproducto.IdOferta,
      NuevoActualProductos:
        parseInt(dataproducto.actualProductos) + parseInt(contador),
    };

    await fetch(`${apiUrl}/ofertas`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Error al actualizar oferta");
        crearCompraIndividual();
      })
      .catch(() => {
        Alert.alert(
          "Aviso",
          "Ha habido un error al intentar realizar el pago",
          [
            {
              text: "Aceptar",
              onPress: () => {
                setDisabled(false);
                oncloseexito();
              },
            },
          ],
          { cancelable: false }
        );
      });
  };

  return (
    <Modal
      visible={isvisibleUnirseOfertaAhoraModal}
      animationType="slide"
      transparent={true}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <ScrollView>
            <Text style={styles.titulo}>Pagar ahora</Text>

            {/* Producto */}
            <View style={styles.firstContainer}>
              <Image
                source={{
                  uri: dataproducto?.datosProd?.urlImg ?? "",
                }}
                style={styles.imageContainer}
              />
              <View style={styles.starsContainer}>
                <StyledText color="primary" fontWeight="bold">
                  {dataproducto?.datosProd?.nombreProd ?? ""}
                </StyledText>
                <StyledText color="primary">
                  P. Instantáneo: ${dataproducto?.datosProd?.costoInst ?? 0}
                </StyledText>
                <StyledText color="primary">
                  U. Disponibles: {unidadesdisponibles}
                </StyledText>
              </View>
            </View>

            {/* Proveedor */}
            <View style={styles.secondFirstContainer}>
              <StyledText color="primary" fontWeight="bold">
                Proveedor:
              </StyledText>
              <StyledText color="primary">
                {dataproducto?.nombreProveedor ?? ""}
              </StyledText>
            </View>

            {/* Fecha */}
            <View style={styles.fechaCierreContainer}>
              <StyledText color="primary" fontWeight="bold">
                Fecha cierre:{" "}
              </StyledText>
              <StyledText color="primary">
                {fechaLimiteObj.toLocaleString(undefined, dateOptions)}
              </StyledText>
            </View>

            {/* Saldo de estrellas */}
            <View style={styles.saldoBox}>
              <StyledText fontWeight="bold" color="primary">
                ⭐ Tu saldo: {saldoEstrellas} Estrellas
              </StyledText>
            </View>

            {/* Selector de descuento */}
            <SelectorDescuento
              descuentos={descuentos}
              descuentoSeleccionado={descuentoSeleccionado}
              onSelectDescuento={handleSelectDescuento}
              montoOriginal={calcularSubtotal()}
            />

            {/* Contador y total */}
            <View style={styles.contadorTotalContainer}>
              <View style={styles.unidadesContainer}>
                <Text style={styles.contadorTexto}>{contador}</Text>
                <View style={{ flexDirection: "row" }}>
                  <Button title="-" onPress={decrementarContador} />
                  <Button title="+" onPress={incrementarContador} />
                </View>
              </View>
              
              <View style={styles.totalContainer}>
                <View style={styles.resumenBox}>
                  <View style={styles.fila}>
                    <Text style={styles.textoNormal}>Subtotal:</Text>
                    <Text style={styles.textoNormal}>${calcularSubtotal().toFixed(2)}</Text>
                  </View>
                  
                  {descuentoSeleccionado && (
                    <View style={styles.fila}>
                      <Text style={styles.textoDescuento}>Descuento:</Text>
                      <Text style={styles.textoDescuento}>
                        -${calcularDescuento().toFixed(2)}
                      </Text>
                    </View>
                  )}
                  
                  <View style={[styles.fila, styles.filaTotal]}>
                    <Text style={styles.textoTotal}>Total:</Text>
                    <Text style={styles.textoTotal}>${calcularTotal().toFixed(2)}</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Botones */}
            <View style={styles.botonesContainer}>
              <ButtonWithText
                anyfunction={() => {
                  setContador(0);
                  setDescuentoSeleccionado(null);
                  oncloseUnirseOfertaAhora();
                }}
                title="Cancelar"
                color={theme.colors.red}
              />
              <ButtonWithText
                anyfunction={pagarahora}
                title="Continuar"
                color={disabled ? "gray" : theme.colors.lightblue1}
                disabled={disabled}
              />
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: "#ffffff",
    width: '90%',
    maxHeight: '90%',
    padding: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  titulo: {
    color: "black",
    margin: 10,
    fontWeight: "bold",
    fontSize: 18,
    textAlign: 'center',
  },
  firstContainer: {
    marginVertical: 5,
    padding: 5,
    borderWidth: 1,
    borderColor: theme.colors.lightGray3,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
  },
  imageContainer: { 
    width: "40%", 
    height: 90, 
    resizeMode: "contain" 
  },
  starsContainer: { 
    width: "60%" 
  },
  secondFirstContainer: {
    flexDirection: "row",
    marginVertical: 10,
    width: "100%",
    padding: 5,
    borderWidth: 1,
    borderColor: theme.colors.lightGray3,
    borderRadius: 8,
  },
  fechaCierreContainer: {
    width: "100%",
    flexDirection: "row",
    marginVertical: 5,
    padding: 5,
    borderWidth: 1,
    borderColor: theme.colors.lightGray3,
    borderRadius: 8,
  },
  saldoBox: {
    padding: 12,
    backgroundColor: '#f9f9f9',
    marginVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.lightGray3,
  },
  contadorTotalContainer: {
    marginVertical: 10,
  },
  unidadesContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    padding: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: theme.colors.lightGray3,
    borderRadius: 8,
  },
  contadorTexto: {
    marginHorizontal: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalContainer: {
    width: "100%",
  },
  resumenBox: {
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  fila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  filaTotal: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: theme.colors.lightGray3,
  },
  textoNormal: {
    fontSize: 14,
    color: '#333',
  },
  textoDescuento: {
    fontSize: 14,
    color: '#2e7d32',
    fontWeight: '600',
  },
  textoTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.blue,
  },
  botonesContainer: {
    flexDirection: "row",
    padding: 10,
    justifyContent: "space-between",
    width: "100%",
  },
});