import React, { useState } from "react";
import { Modal, View, Text, Image, StyleSheet, Alert } from "react-native";
import { ButtonWithText } from "../../proveedores/components/ButtonWithText";
import theme from "../../theme";
import { RadioButton } from "react-native-paper";
import { apiUrl } from "../../../apiUrl";
import { useData } from "../../hooks/OfertasDataProvider";
import { useDescuentos } from "../hooks/DescuentosDataProvider"; 
import { useRecompensas } from "../../hooks/RecompensasDataProvider"; 

export const MetodoPagoModal = ({
  isvisibleMetodoPagoModal,
  valortotal,
  oncloseMetodoPago,
  oncloseReservado,
  dataproducto,
  contador,
  descuentoSeleccionado,
}) => {
  const [checked, setChecked] = React.useState("");
  const { getOfertasTodos } = useData();
  const { refreshDescuentos } = useDescuentos();
  const { refreshBalance } = useRecompensas();
  const [disabled, setDisabled] = useState(false);

  const actualizarOferta = async () => {
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
        if (!response.ok) {
          throw new Error("La solicitud no fue exitosa");
        }
        
        getOfertasTodos();
        refreshDescuentos();
        refreshBalance();

        const mensajeTipo = checked === "Reserva" 
          ? "Reserva" 
          : "Pago Anticipado";

        Alert.alert(
          "¡Éxito!",
          `El pago de tipo ${mensajeTipo} se ha realizado con éxito. Te has unido correctamente a la oferta`,
          [
            {
              text: "Aceptar",
              onPress: () => {
                setDisabled(false);
                setChecked("");
                oncloseReservado();
              },
            },
          ],
          { cancelable: false }
        );
      })
      .catch(() => {
        Alert.alert(
          "Error en la oferta",
          "Ha habido un error al intentar realizar el pago",
          [
            {
              text: "Aceptar",
              onPress: () => {
                setDisabled(false);
                oncloseReservado();
              },
            },
          ],
          { cancelable: false }
        );
      });
  };

  const crearCompraIndividual = async () => {
    // Determinar el método de pago y tipo de compra
    const metodoPago = checked === "Reserva" ? "reserva" : "anticipado";
    const tipoCompra = checked === "Reserva" ? "normal" : "anticipada";
    const pagadoAProveedor = checked === "Pago Anticipado"; // Si es anticipado, ya está pagado

    const body = {
      IdComprador: dataproducto.IdUsuario,
      IdProveedor: dataproducto.proveedor.IdUsuario,
      IdOferta: dataproducto.IdOferta,
      Cantidad: contador,
      Total: valortotal,
      Descripcion: "",
      Observacion: "",
      IdEstado: dataproducto.estadoOferta.IdEstadosOferta,
      MetodoPago: metodoPago,
      PagadoAProveedor: pagadoAProveedor,
      TipoCompra: tipoCompra,
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
        actualizarOferta();
      })
      .catch(() => {
        Alert.alert(
          "Error en la orden de compra",
          "Ha habido un error al intentar crear la orden de compra",
          [
            {
              text: "Aceptar",
              onPress: () => {
                setDisabled(false);
                oncloseReservado();
              },
            },
          ],
          { cancelable: false }
        );
      });
  };

  const postpago = () => {
    if (!checked) {
      Alert.alert(
        "Selecciona un método de pago",
        "Por favor selecciona 'Reserva' o 'Pago Anticipado' para continuar"
      );
      setDisabled(false);
      return;
    }

    const mensajeTipo = checked === "Reserva" 
      ? "Reserva (pagarás al completarse la oferta)" 
      : "Pago Anticipado (pagas ahora)";

    Alert.alert(
      `Efectuando ${checked}`,
      `${mensajeTipo}\n\nTotal a pagar: $${valortotal.toFixed(2)}`,
      [
        {
          text: "Cancelar",
          style: "cancel",
          onPress: () => setDisabled(false),
        },
        {
          text: "Confirmar",
          onPress: () => {
            crearCompraIndividual();
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <Modal transparent visible={isvisibleMetodoPagoModal} animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header} />
          
          <Text style={styles.titulo}>
            Seleccione Método de Pago:
          </Text>

          {/* Mostrar descuento aplicado */}
          {descuentoSeleccionado && (
            <View style={styles.descuentoBox}>
              <Text style={styles.descuentoTexto}>
                ✅ Descuento aplicado: {descuentoSeleccionado.Nombre || descuentoSeleccionado.codigo}
              </Text>
              <Text style={styles.descuentoValor}>
                ({descuentoSeleccionado.PorcentajeDescuento || descuentoSeleccionado.Porcentaje}% de descuento)
              </Text>
            </View>
          )}

          <View style={{ alignItems: "center", marginVertical: 10 }}>
            <Image
              source={{
                uri: "https://1000marcas.net/wp-content/uploads/2019/12/logo-Paypal.png",
              }}
              style={{ width: 250, height: 100, resizeMode: 'contain' }}
            />
          </View>

          <View style={styles.opcionesContainer}>
            {/* Opción: Pago Anticipado */}
            <View style={styles.opcionRow}>
              <RadioButton
                value="Pago Anticipado"
                status={checked === "Pago Anticipado" ? "checked" : "unchecked"}
                onPress={() => setChecked("Pago Anticipado")}
                color={theme.colors.blue}
              />
              <View style={styles.opcionTexto}>
                <Text style={styles.opcionTitulo}>Pago Anticipado</Text>
                <Text style={styles.opcionDescripcion}>
                  Pagas ahora y recibes tu producto cuando la oferta cierre
                </Text>
              </View>
            </View>

            {/* Opción: Reserva */}
            <View style={styles.opcionRow}>
              <RadioButton
                value="Reserva"
                status={checked === "Reserva" ? "checked" : "unchecked"}
                onPress={() => setChecked("Reserva")}
                color={theme.colors.blue}
              />
              <View style={styles.opcionTexto}>
                <Text style={styles.opcionTitulo}>Reserva</Text>
                <Text style={styles.opcionDescripcion}>
                  Reservas tu lugar y pagas cuando la oferta se complete
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.totalBox}>
            <Text style={styles.totalTexto}>
              Total a pagar: <Text style={styles.totalValor}>${valortotal.toFixed(2)}</Text>
            </Text>
          </View>

          <View style={styles.botonesContainer}>
            <ButtonWithText
              anyfunction={() => {
                setChecked("");
                oncloseMetodoPago();
              }}
              title="Cancelar"
              color={theme.colors.red}
            />
            <ButtonWithText
              anyfunction={() => {
                setDisabled(true);
                postpago();
              }}
              title="Continuar"
              color={disabled ? "gray" : theme.colors.lightblue1}
              disabled={disabled}
            />
          </View>
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
    alignItems: "center",
    width: '90%',
    maxHeight: '85%',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    borderRadius: 15,
  },
  header: {
    width: "100%",
    height: 30,
    backgroundColor: "#9434DB",
    borderTopStartRadius: 15,
    borderTopEndRadius: 15,
  },
  titulo: {
    color: "black",
    margin: 15,
    fontWeight: "bold",
    fontSize: 18,
  },
  descuentoBox: {
    backgroundColor: '#e8f5e9',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 20,
    marginBottom: 10,
    width: '90%',
  },
  descuentoTexto: {
    color: '#2e7d32',
    fontWeight: '600',
    fontSize: 14,
    textAlign: 'center',
  },
  descuentoValor: {
    color: '#2e7d32',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
  opcionesContainer: {
    width: '90%',
    paddingVertical: 10,
  },
  opcionRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 15,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    backgroundColor: '#fafafa',
  },
  opcionTexto: {
    flex: 1,
    marginLeft: 10,
  },
  opcionTitulo: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  opcionDescripcion: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
  totalBox: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 20,
    marginVertical: 10,
    width: '90%',
  },
  totalTexto: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
  },
  totalValor: {
    fontWeight: 'bold',
    color: theme.colors.blue,
    fontSize: 18,
  },
  botonesContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-evenly",
    paddingVertical: 15,
  },
});