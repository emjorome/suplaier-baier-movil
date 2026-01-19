import { View, StyleSheet } from "react-native";
import StyledText from "../../styles/StyledText";
import { StatusBar } from "expo-status-bar";
import Icon from "react-native-ico-material-design";
import theme from "../../theme";
import OfertasList from "../components/OfertasList";
import OfertasDataProvider from "../../hooks/OfertasDataProvider";

/**
 * OfertasProveedorPage - Página que muestra la lista de ofertas del proveedor
 * Esta es la página que antes estaba en HomeProveedorPage
 */
const OfertasProveedorPage = () => {
  return (
    <View style={styles.container}>
      <View style={styles.misOfertasContainer}>
        <View style={styles.topContainer}>
          <Icon name="keyboard-right-arrow-button" width={20} height={20} />
          <StyledText
            fontWeight="bold"
            fontSize="subtitle"
            style={styles.textMisOfertas}
          >
            Mis ofertas
          </StyledText>
        </View>
        <View style={styles.borderLine} />
      </View>
      <OfertasDataProvider>
        <OfertasList />
      </OfertasDataProvider>

      <View style={styles.spaceBorder} />
      <StatusBar style="light" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 10,
    flex: 1,
  },
  misOfertasContainer: {},
  topContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  textMisOfertas: {
    marginLeft: 5,
  },
  borderLine: {
    borderBottomColor: theme.colors.lightGray2,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginTop: 5,
    marginBottom: 10,
  },
  spaceBorder: {
    marginTop: 45,
  },
});

export default OfertasProveedorPage;

