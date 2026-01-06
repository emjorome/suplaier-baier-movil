import {
  View,
  Image,
  Modal,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../auth/context/AuthContext";

import StyledText from "../../styles/StyledText";
import theme from "../../theme";
import { ButtonWithText } from "./ButtonWithText";
import { dateOptions } from "../../components/dateOptions";
import { apiUrl } from "../../../apiUrl";

export const ResumenOferta = ({
  isvisible,
  onclose,
  datosProducto,
  values,
}) => {
  const {
    authState: { user },
  } = useContext(AuthContext);
  const [disabled, setDisabled] = useState(false);
  const [fechaMostrar, setFechaMostrar] = useState("");

  const uploadDemanda = async () => {
    setDisabled(true);
    const fechaEnvio = values.date;
    const año = fechaEnvio.getFullYear();
    const mes = fechaEnvio.getMonth() + 1;
    const dia = fechaEnvio.getDate();
    const fechaFormateada = `${año}-${mes < 10 ? "0" + mes : mes}-${
      dia < 10 ? "0" + dia : dia
    }`;
    // IdProducto, IdProveedor, IdEstadosOferta, Minimo, Maximo, Descripcion, ActualProductos, FechaLimite, Estado, ValorUProducto
    const body = {
      IdProducto: parseInt(values.product),
      IdProveedor: user.IdUsuario,
      IdEstadosOferta: 1,
      Minimo: parseInt(values.umin),
      Maximo: parseInt(values.umax),
      Descripcion: values.description,
      ActualProductos: 0,
      FechaLimite: fechaFormateada,
      Estado: 1,
      ValorUProducto: values.pmin,
      ValorUInstantaneo: values.idValorInst === "conInst" ? values.pmax : 0,
    };

    await fetch(`${apiUrl}/ofertas`, {
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
        Alert.alert(
          "¡Éxito!",
          "Se ha creado la oferta con éxito",
          [
            {
              text: "Aceptar",
              onPress: () => {
                onclose();
                setDisabled(false);
              },
            },
          ],
          { cancelable: false }
        );
      })
      .catch(() => {
        Alert.alert(
          "Error",
          "Ha habido un error al intentar crear la oferta",
          [
            {
              text: "Aceptar",
              onPress: () => {
                onclose();
                setDisabled(false);
              },
            },
          ],
          { cancelable: false }
        );
      });
  };
  useEffect(() => {
    const fechaMostrar = values.date;
    fechaMostrar.setHours(0);
    fechaMostrar.setMinutes(0);
    fechaMostrar.setSeconds(0);
    setFechaMostrar(fechaMostrar);
  }, []);
  return (
    <Modal visible={isvisible} transparent animationType="slide">
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.tituloContainer}>
            <StyledText
              fontWeight="bold"
              color="purple"
              style={styles.textName}
              fontSize="subtitle"
            >
              Resumen de la oferta
            </StyledText>
            <ButtonWithText
              anyfunction={onclose}
              title=""
              icon="close-sharp"
              color={theme.colors.red2}
            />
          </View>
          <View style={styles.soloContainer}>
            <StyledText color="purple" fontWeight="bold">
              Producto:{" "}
            </StyledText>
            <StyledText color="primary">{datosProducto?.Name}</StyledText>
          </View>
          <View style={styles.productoContainer}>
            <Image
              source={
                datosProducto?.UrlImg != null &&
                datosProducto?.UrlImg != "no-img.jpeg"
                  ? {
                      uri: datosProducto?.UrlImg,
                    }
                  : require("../../../public/no-img.jpeg")
              }
              style={styles.imageContainer}
            />
            <StyledText color="primary" style={styles.textProductoDescripcion}>
              {datosProducto?.Descripcion}
            </StyledText>
          </View>
          <View style={styles.soloContainerRow}>
            <StyledText color="purple" fontWeight="bold">
              Precio unitario:{" "}
            </StyledText>
            <StyledText color="primary">{values.pmin}$</StyledText>
          </View>
          {values.idValorInst === "conInst" && (
            <View style={styles.soloContainerRow}>
              <StyledText color="purple" fontWeight="bold">
                Precio instantáneo:{" "}
              </StyledText>
              <StyledText color="primary">{values.pmax}$</StyledText>
            </View>
          )}
          {values.idValorInst === "sinInst" && (
            <View style={styles.soloContainerRow}>
              <StyledText color="purple" fontWeight="bold">
                Valor instantáneo:{" "}
              </StyledText>
              <StyledText color="primary">Sin precio instantáneo</StyledText>
            </View>
          )}
          <View style={styles.soloContainer}>
            <StyledText color="purple" fontWeight="bold">
              Descripción:{" "}
            </StyledText>
            <StyledText color="primary">{values.description}</StyledText>
          </View>
          <View style={styles.soloContainerRow}>
            <StyledText color="purple" fontWeight="bold">
              Cantidad mínima de productos:{" "}
            </StyledText>
            <StyledText color="primary">{values.umin}</StyledText>
          </View>
          <View style={styles.soloContainerRow}>
            <StyledText color="purple" fontWeight="bold">
              Cantidad total de productos:{" "}
            </StyledText>
            <StyledText color="primary">{values.umax}</StyledText>
          </View>
          <View style={styles.soloContainer}>
            <StyledText color="purple" fontWeight="bold">
              Fecha límite:{" "}
            </StyledText>
            <StyledText color="primary">
              {fechaMostrar.toLocaleString(undefined, dateOptions)}
            </StyledText>
          </View>
          <ButtonWithText
            anyfunction={() => uploadDemanda()}
            title="Crear oferta"
            color={disabled ? "gray" : theme.colors.blue}
            disabled={disabled}
          />
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    flex: 1,
    padding: "5%",
    margin: "3%",
    marginTop: "20%",
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

  tituloContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textName: { margin: 5, width: "70%" },
  iconBehave: {
    padding: 14,
  },
  firstContainer: {
    padding: 5,
    borderWidth: 1,
    borderColor: theme.colors.lightGray3,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
  },
  soloContainer: {
    marginVertical: 5,
    width: "100%",
    padding: 5,
    borderWidth: 1,
    borderColor: theme.colors.lightGray3,
    borderRadius: 8,
  },
  soloContainerRow: {
    marginVertical: 5,
    width: "100%",
    padding: 5,
    borderWidth: 1,
    borderColor: theme.colors.lightGray3,
    borderRadius: 8,
    flexDirection: "row",
  },
  productoContainer: {
    borderWidth: 1,
    borderColor: theme.colors.gray2,
    borderRadius: 5,
    marginBottom: 5,
    padding: 8,
  },
  imageContainer: {
    width: "100%",
    height: 200,
    resizeMode: "contain",
  },
  textProductoDescripcion: {
    width: "100%",
    padding: 7,
    textAlign: "center",
  },
});
