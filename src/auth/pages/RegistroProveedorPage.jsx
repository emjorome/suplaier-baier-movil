import { StyleSheet, View, TouchableOpacity, ScrollView } from "react-native";
import { useState } from "react";
import { Formik, useField } from "formik";
import { StatusBar } from "expo-status-bar";
import { Octicons, Ionicons } from "@expo/vector-icons";
import { useNavigate } from "react-router-native";
import { apiUrl } from "../../../apiUrl";
import theme from "../../theme";
import StyledText from "../../styles/StyledText";
import StyledTextInput from "../../styles/StyledTextInput";
import UploadImage from "../../styles/UploadImage";
import RegisterValidationSchema from "../components/RegisterValidationSchema";
import PropTypes from "prop-types";

const initialValues = {
  user: "",
  password: "",
  password2: "",
  mail: "",
  nombre: "",
  tipoID: "",
};

const FormikInputValue = ({
  name,
  icon,
  label,
  isPassword,
  hidePassword,
  setHidePassword,
  isDropDown,
  ...props
}) => {
  const [field, meta, helpers] = useField(name);

  return (
    <View>
      <Octicons
        style={styles.leftIcon}
        name={icon}
        size={30}
        color={theme.colors.purple1}
      />

      <StyledText style={styles.textInputLabel}>{label}</StyledText>

      <StyledTextInput
        value={field.value}
        onChangeText={(value) => helpers.setValue(value)}
        {...props}
      />

      {isPassword && (
        <TouchableOpacity
          style={styles.rightIcon}
          onPress={() => setHidePassword(!hidePassword)}
        >
          <Ionicons
            name={hidePassword ? "md-eye-off" : "md-eye"}
            size={30}
            color={theme.colors.gray1}
          />
        </TouchableOpacity>
      )}

      {meta.error && (
        <StyledText style={styles.errorText} fontSize="body">
          {meta.error}
        </StyledText>
      )}
    </View>
  );
};

FormikInputValue.propTypes = {
  name: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  isPassword: PropTypes.bool,
  hidePassword: PropTypes.bool,
  setHidePassword: PropTypes.func,
  isDropDown: PropTypes.bool,
};

const RegistroProveedorPage = () => {
  const [hidePassword, setHidePassword] = useState(true);
  const navigate = useNavigate();

  const getRegResponse = async (username, password, mail, nombre, tipoID) => {
    const body = {
      idRol: 2,
      nombre,
      tipoID,
      usuario: username,
      pass: password,
      correo: mail,
    };

    const resp = await globalThis.fetch(`${apiUrl}/solicitudRegistro`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await resp.json();
    return data.length === 0 ? null : data[0];
  };

  const onSubmitRegister = (values) => {
    getRegResponse(
      values.user,
      values.password,
      values.mail,
      values.nombre,
      values.tipoID
    );
  };

  return (
    <>
      <ScrollView>
        <StyledText
          color="tertiary"
          fontWeight="bold"
          fontSize="title"
          style={styles.pageTitle}
        >
          Registrar Proveedor
        </StyledText>

        <StyledText
          color="tertiary"
          fontWeight="normal"
          fontSize="subheading"
          style={styles.subtitle}
        >
          Por favor ingresa los siguientes datos
        </StyledText>

        <Formik
          validationSchema={RegisterValidationSchema}
          initialValues={initialValues}
          onSubmit={(values) => onSubmitRegister(values)}
        >
          {({ handleSubmit }) => (
            <View style={styles.form}>
              <FormikInputValue
                name="user"
                icon="person"
                placeholder="Usuario"
                placeholderTextColor={theme.colors.gray1}
                label="Usuario"
              />

              <FormikInputValue
                name="password"
                icon="lock"
                placeholder="**********"
                placeholderTextColor={theme.colors.gray1}
                secureTextEntry={hidePassword}
                label="Contraseña"
                isPassword
                hidePassword={hidePassword}
                setHidePassword={setHidePassword}
              />

              <FormikInputValue
                name="password2"
                icon="lock"
                placeholder="**********"
                placeholderTextColor={theme.colors.gray1}
                secureTextEntry={hidePassword}
                label="Confirmar Contraseña"
                isPassword
                hidePassword={hidePassword}
                setHidePassword={setHidePassword}
              />

              <FormikInputValue
                name="mail"
                icon="mail"
                placeholder="Correo@ejemplo.com"
                placeholderTextColor={theme.colors.gray1}
                label="Correo Electrónico"
              />

              <FormikInputValue
                name="nombre"
                icon="note"
                placeholder="Nombre"
                placeholderTextColor={theme.colors.gray1}
                label="Nombre Completo"
              />

              <FormikInputValue
                name="tipoID"
                icon="id-badge"
                placeholder="000000000"
                placeholderTextColor={theme.colors.gray1}
                secureTextEntry={false}
                label="ID"
                isDropDown
              />

              <StyledText style={styles.textInputLabel}>Imagen</StyledText>
              <UploadImage />

              <View style={styles.borderLine} />

              <TouchableOpacity style={styles.registerButton} onPress={handleSubmit}>
                <StyledText fontSize="subheading" color="secondary" fontWeight="bold">
                  Registrarse
                </StyledText>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() =>
                  navigate("/login", {
                    replace: true,
                  })
                }
              >
                <StyledText fontSize="subheading" color="secondary" fontWeight="bold">
                  Cancelar
                </StyledText>
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </ScrollView>

      <StatusBar style="light" />
    </>
  );
};

const styles = StyleSheet.create({
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
  pageTitle: {
    textAlign: "center",
    padding: 10,
    marginTop: 20,
  },
  form: {
    margin: 20,
  },
  textInputLabel: {
    color: theme.colors.purple,
    textAlign: "left",
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
  registerButton: {
    padding: 15,
    backgroundColor: theme.colors.lightgreen,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginVertical: 5,
    height: 60,
  },
  borderLine: {
    borderBottomColor: theme.colors.gray1,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginVertical: 15,
  },
  errorText: {
    color: theme.colors.red,
    marginBottom: 10,
    marginTop: -13,
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
});

export default RegistroProveedorPage;
