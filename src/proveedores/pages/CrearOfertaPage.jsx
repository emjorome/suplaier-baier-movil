/* eslint-disable no-unused-vars */
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useState, useContext, useEffect } from "react";
import { Formik, useField } from "formik";
import { StatusBar } from "expo-status-bar";
import { Octicons } from "@expo/vector-icons";
import { apiUrl } from "../../../apiUrl";
import theme from "../../theme";
import StyledText from "../../styles/StyledText";
import StyledTextInput from "../../styles/StyledTextInput";
import crearOfertaValidationSchema from "../components/crearOfertaValidationSchema";
import { AuthContext } from "../../auth/context/AuthContext";
import StyledSelectList from "../../styles/StyledSelectList";
import { ResumenOferta } from "../components/ResumenOferta";
import DateTimePicker from "react-native-modal-datetime-picker";
const initialValues = {
  pmax: "",
  pmin: "",
  idValorInst: "sinInst",
};

const FormikInputValue = ({
  name,
  icon,
  label,
  isPassword,
  hidePassword = false,
  setHidePassword,
  isDropDown,
  productosSelectList,
  setSelected,
  selected,
  getSelectProduct,
  isWithPeticion,
  ...props
}) => {
  const [field, meta, helpers] = useField(name);
  
  // Sincronizar el estado local con Formik cuando cambia
  useEffect(() => {
    if (isDropDown && selected && field.value !== selected) {
      helpers.setValue(selected);
    }
  }, [selected]);
  
  // Inicializar el valor seleccionado desde Formik
  useEffect(() => {
    if (isDropDown && field.value && !selected) {
      setSelected(field.value);
    }
  }, [field.value]);

  return (
    <View>
      <StyledText style={styles.textInputLabel}>{label}</StyledText>
      {isDropDown ? (
        <>
          {icon && (
            <Octicons
              style={styles.leftIcon}
              name={icon}
              size={30}
              color={theme.colors.purple1}
            />
          )}
          <StyledSelectList
            setSelected={(val) => {
              setSelected(val);
              helpers.setValue(val);
            }}
            onSelect={() => {
              if (isWithPeticion) {
                getSelectProduct();
              }
            }}
            data={productosSelectList}
            save="key"
            error={meta.error}
            {...props}
          />
        </>
      ) : (
        <>
          <Octicons
            style={styles.leftIcon}
            name={icon}
            size={30}
            color={theme.colors.purple1}
          />
          <StyledTextInput
            error={meta.error}
            value={field.value}
            onChangeText={(value) => helpers.setValue(value)}
            {...props}
          />
        </>
      )}
      {meta.error && (
        <StyledText
          style={isDropDown ? styles.errorTextSelect : styles.errorText}
          fontSize="body"
          testID={props.testIDError}
        >
          {meta.error}
        </StyledText>
      )}
    </View>
  );
};

const FormikDateValue = ({ name, icon, label, ...props }) => {
  const [field, meta, helpers] = useField(name);
  const fechaLimiteMinimo = new Date();
  const fechaLimiteMaximo = new Date();
  fechaLimiteMinimo.setDate(fechaLimiteMinimo.getDate() + 1);
  fechaLimiteMaximo.setDate(fechaLimiteMinimo.getDate() + 183);
  const [date, setDate] = useState();

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  const handleConfirm = (date) => {
    // console.warn("A date has been picked: ", date);
    setDate(date);
    helpers.setValue(date);
    hideDatePicker();
  };
  return (
    <View>
      <StyledText style={styles.textInputLabel}>{label}</StyledText>
      <TouchableOpacity style={styles.dateButton} onPress={showDatePicker}>
        <StyledText fontSize="subheading" color="secondary" fontWeight="bold">
          Escoger fecha límite
        </StyledText>
      </TouchableOpacity>
      <DateTimePicker
        isVisible={isDatePickerVisible}
        mode="date"
        minimumDate={fechaLimiteMinimo}
        maximumDate={fechaLimiteMaximo}
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
      {meta.error && (
        <StyledText style={styles.errorTextSelect} fontSize="body">
          {meta.error}
        </StyledText>
      )}
    </View>
  );
};

const CrearOfertaPage = () => {
  const { authState } = useContext(AuthContext);
  const { user } = authState;
  //   const [date, setDate] = useState(new Date());
  const [openDate, setOpenDate] = useState(false);
  const [productosSelectList, setProductosSelectList] = useState([]);
  const [selected, setSelected] = useState("");
  const [productoSelected, setProductoSelected] = useState("");
  const [isvisibleresumen, setisvisibleresumen] = useState(false);
  const [values, setValues] = useState();
  const [idValorInst, setIdValorInst] = useState("sinInst");
  const valorInstLista = [
    { key: "sinInst", value: "Sin precio instantáneo" },
    { key: "conInst", value: "Con precio instantáneo" },
  ];

  const getProductos = async () => {
    try {
      const resp = await fetch(
        `${apiUrl}/productos/onlyNames?idProveedor=${user.IdUsuario}`
      );
      const data = await resp.json();
      const { rows: productos } = !!data && data;

      const productosComprador = productos.map((producto) => {
        return { key: producto.IdProducto, value: producto.Name };
      });
      setProductosSelectList(productosComprador);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };
  const getSelectProduct = async () => {
    try {
      console.log(selected);
      const resp = await fetch(`${apiUrl}/productos?id=${selected}`);
      const data = await resp.json();
      const { rows: productos } = !!data && data;
      setProductoSelected(productos[0]);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };
  useEffect(() => {
    getProductos();
  }, []);
  const onMostrarResumen = (values) => {
    console.log("ENTRE");
    setValues(values);
    setisvisibleresumen(true);
  };
  return (
    <>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <StyledText
          color="tertiary"
          fontWeight="bold"
          fontSize="title"
          style={styles.pageTitle}
        >
          Crear oferta
        </StyledText>
        <StyledText
          color="tertiary"
          fontWeight="normal"
          fontSize="subheading"
          style={styles.subtitle}
        >
          ¡Crea una oferta con tu producto para los compradores!
        </StyledText>

        <Formik
          validationSchema={crearOfertaValidationSchema}
          initialValues={initialValues}
          onSubmit={(values) => onMostrarResumen(values)}
        >
          {({ handleSubmit, values: formValues }) => {
            return (
              <View style={styles.form}>
                <FormikInputValue
                  name="product"
                  setSelected={setSelected}
                  selected={selected}
                  placeholder="Selecciona uno de tus productos"
                  placeholderTextColor={theme.colors.textPrimary}
                  label="Producto"
                  searchPlaceholder="Buscar"
                  isDropDown
                  productosSelectList={productosSelectList}
                  getSelectProduct={getSelectProduct}
                  isWithPeticion
                />
                {selected && (
                  <View style={styles.productoContainer}>
                    <Image
                      source={
                        productoSelected?.UrlImg != null &&
                        productoSelected?.UrlImg != "no-img.jpeg"
                          ? {
                              uri: productoSelected?.UrlImg,
                            }
                          : require("../../../public/no-img.jpeg")
                      }
                      style={styles.imageContainer}
                    />
                    <StyledText
                      color="primary"
                      style={styles.textProductoDescripcion}
                    >
                      {productoSelected?.Descripcion}
                    </StyledText>
                  </View>
                )}
                <FormikInputValue
                  name="pmin"
                  keyboardType="decimal-pad"
                  placeholder="Precio por unidad"
                  icon="tag"
                  placeholderTextColor={theme.colors.gray1}
                  label="Precio unitario"
                  testID="CrearOferta.InputPU"
                  testIDError="CrearOferta.Error.InputPU"
                />
                <FormikInputValue
                  name="idValorInst"
                  setSelected={setIdValorInst}
                  selected={formValues.idValorInst || idValorInst}
                  placeholder="Selecciona si incluye precio instantáneo"
                  placeholderTextColor={theme.colors.textPrimary}
                  label="Valor instantáneo"
                  searchPlaceholder="Buscar"
                  isDropDown
                  productosSelectList={valorInstLista}
                />
                {(formValues.idValorInst === "conInst" || idValorInst === "conInst") && (
                  <FormikInputValue
                    name="pmax"
                    keyboardType="decimal-pad"
                    placeholder="Precio para compra instantánea"
                    icon="star"
                    placeholderTextColor={theme.colors.gray1}
                    label="Precio Instantáneo"
                    testID="CrearOferta.InputPI"
                    testIDError="CrearOferta.Error.InputPI"
                  />
                )}
                <FormikInputValue
                  name="description"
                  icon="list-unordered"
                  placeholder="Descripción de la demanda"
                  placeholderTextColor={theme.colors.gray1}
                  multiline
                  numberOfLines={8}
                  textAreaSize="descripcion"
                  label="Descripción"
                  testID="CrearOferta.InputDescripcion"
                  testIDError="CrearOferta.Error.InputDescripcion"
                />
                <FormikInputValue
                  name="umin"
                  keyboardType="numeric"
                  placeholderTextColor={theme.colors.gray1}
                  label="Cantidad mínima"
                  placeholder="Cantidad mínima de productos"
                  icon="package"
                  testID="CrearOferta.InputUMin"
                  testIDError="CrearOferta.Error.InputUMin"
                />
                <FormikInputValue
                  name="umax"
                  keyboardType="numeric"
                  placeholderTextColor={theme.colors.gray1}
                  label="Cantidad total"
                  placeholder="Cantidad total de productos"
                  icon="stack"
                  testID="CrearOferta.InputUMax"
                  testIDError="CrearOferta.Error.InputUMax"
                />
                <FormikDateValue name="date" label="Fecha límite" />

                <View style={styles.borderLine} />
                <TouchableOpacity
                  style={styles.registerButton}
                  onPress={handleSubmit}
                  testID="CrearOferta.Button"
                >
                  <StyledText
                    fontSize="subheading"
                    color="secondary"
                    fontWeight="bold"
                  >
                    Continuar
                  </StyledText>
                </TouchableOpacity>
              </View>
            );
          }}
        </Formik>
      </ScrollView>

      {isvisibleresumen && (
        <ResumenOferta
          isvisible={isvisibleresumen}
          onclose={() => setisvisibleresumen(false)}
          datosProducto={productoSelected}
          values={values}
        />
      )}
      <StatusBar style="light" />
    </>
  );
};
const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "white",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  pageLogo: {
    width: 307.98,
    height: 61.14,
    marginTop: 60,
    marginBottom: 5,
  },
  pageTitle: {
    textAlign: "center",
    padding: 10,
    marginTop: 20,
  },
  form: {
    margin: 15,
    marginHorizontal: 20,
    paddingBottom: 30,
  },
  textInputLabel: {
    color: theme.colors.purple,
    textAlign: "left",
    marginTop: 10,
    marginBottom: 5,
  },

  subtitle: {
    textAlign: "center",
    marginBottom: 20,
    letterSpacing: 1,
    paddingHorizontal: 25,
  },
  leftIcon: {
    left: 15,
    top: 38,
    position: "absolute",
    zIndex: 1,
  },
  rightIcon: {
    right: 15,
    top: 38,
    position: "absolute",
    zIndex: 1,
  },
  submitButton: {
    padding: 15,
    backgroundColor: theme.colors.lightblue1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginVertical: 5,
    height: 60,
  },
  registerButton: {
    padding: 15,
    backgroundColor: theme.colors.lightgreen,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginVertical: 10,
    marginTop: 20,
    height: 55,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dateButton: {
    padding: 15,
    backgroundColor: theme.colors.blue,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginVertical: 8,
    height: 50,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  borderLine: {
    borderBottomColor: theme.colors.gray1,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginVertical: 15,
  },
  bottomText: {
    marginTop: 10,
    textAlign: "center",
  },
  errorText: {
    color: theme.colors.red,
    marginBottom: 10,
    marginTop: -13,
  },
  errorTextSelect: {
    color: theme.colors.red,
    marginBottom: 10,
    marginTop: 0,
  },
  extraView: {
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
  },
  extraText: {
    justifyContent: "center",
    alignContent: "center",
  },
  extraTextLink: {
    justifyContent: "center",
    alignItems: "center",
  },
  textLink: {
    color: theme.colors.purple,
  },

  cancelButton: {
    padding: 15,
    backgroundColor: theme.colors.red,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginVertical: 5,
    height: 60,
  },
  selectBox: {
    marginVertical: 5,
    borderColor: theme.colors.gray2,
  },
  dropDownBox: {
    borderColor: theme.colors.gray2,
    marginBottom: 15,
  },
  productoContainer: {
    borderWidth: 1,
    borderColor: theme.colors.gray2,
    borderRadius: 5,
    marginBottom: 15,
    marginTop: 10,
    padding: 10,
    backgroundColor: theme.colors.white,
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

export default CrearOfertaPage;
