import { StyleSheet, View, Image, TouchableOpacity } from "react-native";
import { useState, useContext } from "react";
import { Formik, useField } from "formik";
import { StatusBar } from "expo-status-bar";
import { Octicons, Ionicons } from "@expo/vector-icons";
import { useNavigate } from "react-router-native";
import { loginValidationSchema } from "../components/loginValidationSchema";
import { apiUrl } from "../../../apiUrl";
import { AuthContext } from "../context/AuthContext";
import theme from "../../theme";
import StyledText from "../../styles/StyledText";
import StyledTextInput from "../../styles/StyledTextInput";
import Animated, { FadeInDown } from "react-native-reanimated";
import PropTypes from "prop-types";

const initialValues = {
  user: "",
  password: "",
};

const FormikInputValue = ({
  name,
  icon,
  label,
  isPassword,
  hidePassword,
  setHidePassword,
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
        error={meta.error}
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

// ⭐ PropTypes para FormikInputValue
FormikInputValue.propTypes = {
  name: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  isPassword: PropTypes.bool,
  hidePassword: PropTypes.bool,
  setHidePassword: PropTypes.func,
};

const LoginPage = () => {
  const [hidePassword, setHidePassword] = useState(true);
  const [credentialsIncorrect, setCredentialsIncorrect] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [disabled, setDisabled] = useState(false);

  const getAuthResponse = async (username, password) => {
    const body = {
      usuario: username,
      pass: password,
    };

    // ⭐ SonarQube fix: usar globalThis en vez de global
    const resp = await globalThis.fetch(`${apiUrl}/auth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await resp.json();

    if (data.length === 0) {
      return null;
    } else {
      return data[0];
    }
  };

  const onSubmitLogin = (values) => {
    setDisabled(true);

    getAuthResponse(values.user.trim(), values.password.trim()).then((user) => {
      setDisabled(false);

      if (user) {
        login(user);
        setCredentialsIncorrect(false);

        navigate("/splash", {
          replace: true,
        });
      } else {
        setCredentialsIncorrect(true);
      }
    });
  };

  return (
    <>
      <Animated.View
        style={styles.container}
        entering={FadeInDown.duration(1000)}
      >
        <Image
          resizeMode="cover"
          source={require("../../../public/suplaier_horizontal_degradado_recortado.png")}
          style={styles.pageLogo}
        />

        <StyledText
          color="tertiary"
          fontWeight="bold"
          fontSize="title"
          style={styles.pageTitle}
        >
          Iniciar sesión
        </StyledText>

        <StyledText
          color="tertiary"
          fontWeight="normal"
          fontSize="subheading"
          style={styles.subtitle}
        >
          Para comenzar inicia sesión con tu usuario y contraseña
        </StyledText>

        <Formik
          validationSchema={loginValidationSchema}
          initialValues={initialValues}
          onSubmit={onSubmitLogin}
        >
          {({ handleSubmit }) => (
            <View style={styles.form}>
              {credentialsIncorrect && (
                <View style={styles.containerCredentialsIncorrect}>
                  <StyledText style={styles.errorText} fontSize="body">
                    Usuario y/o contraseña incorrectos
                  </StyledText>
                </View>
              )}

              <FormikInputValue
                testID="LoginPage.InputUser"
                name="user"
                icon="person"
                placeholder="ejemplo_proveedor.004"
                placeholderTextColor={theme.colors.gray1}
                label="Usuario"
              />

              <FormikInputValue
                testID="LoginPage.InputPassword"
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

              <TouchableOpacity
                style={{
                  padding: 15,
                  backgroundColor: disabled
                    ? "gray"
                    : theme.colors.lightblue1,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 5,
                  marginVertical: 5,
                  height: 60,
                  testID: "LoginPage.LoginButton",
                }}
                onPress={handleSubmit}
                disabled={disabled}
              >
                <StyledText
                  fontSize="subheading"
                  color="secondary"
                  fontWeight="bold"
                >
                  Iniciar sesión
                </StyledText>
              </TouchableOpacity>

              <View style={styles.borderLine} />

              <TouchableOpacity
                testID="LoginPage.RegisterButton"
                style={styles.registerButton}
                onPress={() =>
                  navigate("/signup_type", {
                    replace: true,
                  })
                }
              >
                <StyledText
                  fontSize="subheading"
                  color="secondary"
                  fontWeight="bold"
                >
                  Registrarse
                </StyledText>
              </TouchableOpacity>

              <View style={styles.extraView}>
                <StyledText
                  fontSize="subheading"
                  color="primary"
                  style={styles.extraText}
                >
                  ¿Aún no tienes cuenta?,{" "}
                </StyledText>

                <TouchableOpacity
                  style={styles.extraTextLink}
                  onPress={() =>
                    navigate("/signup_type", {
                      replace: true,
                    })
                  }
                >
                  <StyledText fontSize="subheading" style={styles.textLink}>
                    ¡Regístrate!
                  </StyledText>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Formik>
      </Animated.View>

      <StatusBar style="light" />
    </>
  );
};

// ⭐ PropTypes para LoginPage (aunque no tiene props, se deja vacío)
LoginPage.propTypes = {};

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
  containerCredentialsIncorrect: {
    alignItems: "center",
    justifyContent: "center",
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
  credentialsIncorrect: {
    marginTop: 5,
    marginBottom: 5,
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
});

export default LoginPage;

