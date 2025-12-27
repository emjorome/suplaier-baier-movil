import { StyleSheet, View, Image, TouchableOpacity, ScrollView } from "react-native";
import { useState, useContext } from "react";
import { Formik, useField } from "formik";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useNavigate } from "react-router-native";
import { loginValidationSchema } from "../components/loginValidationSchema";
import { apiUrl } from "../../../apiUrl";
import { AuthContext } from "../context/AuthContext";
import theme from "../../theme";
import StyledText from "../../styles/StyledText";
import StyledTextInput from "../../styles/StyledTextInput";
import Animated, { FadeInDown } from "react-native-reanimated";

const initialValues = {
  user: "",
  password: "",
};

const FormikInputValue = ({
  name,
  label,
  isPassword,
  hidePassword,
  setHidePassword,
  ...props
}) => {
  const [field, meta, helpers] = useField(name);
  return (
    <View style={styles.inputGroup}>
      <StyledText style={styles.inputLabel}>{label}</StyledText>
      <View style={styles.inputContainer}>
        <StyledTextInput
          error={meta.error}
          value={field.value}
          onChangeText={(value) => helpers.setValue(value)}
          style={[
            styles.textInput,
            isPassword && styles.textInputWithIcon
          ]}
          {...props}
        />
        {isPassword && (
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setHidePassword(!hidePassword)}
          >
            <Ionicons
              name={hidePassword ? "eye-off-outline" : "eye-outline"}
              size={24}
              color={theme.colors.gray1}
            />
          </TouchableOpacity>
        )}
      </View>
      {meta.error && (
        <StyledText style={styles.errorText} fontSize="small">
          ⚠️ {meta.error}
        </StyledText>
      )}
    </View>
  );
};

const LoginPage = () => {
  const [hidePassword, setHidePassword] = useState(true);
  const [credentialsIncorrect, setCredentialsIncorrect] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [disabled, setDisabled] = useState(false);

  const getAuthResponse = async (username, password) => {
    try {
      console.log('Intentando login con:', username);
      console.log('URL API:', `${apiUrl}/auth`);
      
      const body = {
        usuario: username,
        pass: password,
      };
      
      const resp = await global.fetch(`${apiUrl}/auth`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      
      console.log('Respuesta status:', resp.status);
      const data = await resp.json();
      console.log('Datos recibidos:', data);

      if (data.length === 0) {
        return null;
      } else {
        return data[0];
      }
    } catch (error) {
      console.error('Error en getAuthResponse:', error);
      return null;
    }
  };

  const onSubmitLogin = async (values) => {
    try {
      console.log('onSubmitLogin llamado con valores:', values);
      setDisabled(true);
      setCredentialsIncorrect(false);
      
      const user = await getAuthResponse(values.user.trim(), values.password.trim());
      
      setDisabled(false);
      
      if (user) {
        console.log('Login exitoso, usuario:', user);
        login(user);
        navigate("/splash", {
          replace: true,
        });
      } else {
        console.log('Login fallido - credenciales incorrectas');
        setCredentialsIncorrect(true);
      }
    } catch (error) {
      console.error('Error en onSubmitLogin:', error);
      setDisabled(false);
      setCredentialsIncorrect(true);
    }
  };

  return (
    <>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Animated.View
          style={styles.container}
          entering={FadeInDown.duration(1000)}
        >
          {/* Header con logo */}
          <View style={styles.header}>
            <Image
              resizeMode="contain"
              source={require("../../../public/suplaier_logo_celeste.png")}
              style={styles.logo}
            />
            <StyledText
              fontWeight="bold"
              fontSize="title"
              style={styles.title}
            >
              Bienvenido de nuevo
            </StyledText>
            <StyledText
              color="textGray"
              fontSize="body"
              style={styles.subtitle}
            >
              Ingresa tus credenciales para acceder a tu cuenta
            </StyledText>
          </View>

          {/* Formulario */}
          <Formik
            validationSchema={loginValidationSchema}
            initialValues={initialValues}
            onSubmit={(values) => onSubmitLogin(values)}
          >
            {({ handleSubmit }) => {
              return (
                <View style={styles.form}>
                  {credentialsIncorrect && (
                    <View style={styles.errorContainer}>
                      <StyledText style={styles.errorText} fontSize="body">
                        ⚠️ Usuario y/o contraseña incorrectos
                      </StyledText>
                    </View>
                  )}
                  
                  <FormikInputValue
                    testID="LoginPage.InputUser"
                    name="user"
                    placeholder="Ej. empresa_sa"
                    placeholderTextColor={theme.colors.gray1}
                    label="Usuario"
                    autoCapitalize="none"
                  />
                  
                  <FormikInputValue
                    testID="LoginPage.InputPassword"
                    name="password"
                    placeholder="••••••••"
                    placeholderTextColor={theme.colors.gray1}
                    secureTextEntry={hidePassword}
                    label="Contraseña"
                    isPassword
                    hidePassword={hidePassword}
                    setHidePassword={setHidePassword}
                  />

                  <TouchableOpacity
                    testID="LoginPage.LoginButton"
                    style={[
                      styles.submitButton,
                      disabled && styles.submitButtonDisabled
                    ]}
                    onPress={handleSubmit}
                    disabled={disabled}
                  >
                    <StyledText
                      fontSize="subheading"
                      color="secondary"
                      fontWeight="bold"
                    >
                      INICIAR SESIÓN
                    </StyledText>
                  </TouchableOpacity>

                  {/* Footer */}
                  <View style={styles.footer}>
                    <StyledText
                      fontSize="body"
                      color="textGray"
                    >
                      ¿Aún no tienes cuenta?{" "}
                    </StyledText>
                    <TouchableOpacity
                      testID="LoginPage.RegisterButton"
                      onPress={() => {
                        navigate("/signup", {
                          replace: true,
                        });
                      }}
                    >
                      <StyledText 
                        fontSize="body" 
                        style={styles.linkText}
                        fontWeight="bold"
                      >
                        Regístrate aquí
                      </StyledText>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            }}
          </Formik>
        </Animated.View>
      </ScrollView>
      <StatusBar style="dark" />
    </>
  );
};
const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.l,
    paddingVertical: theme.spacing.xxl,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: theme.spacing.xxl,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: theme.spacing.l,
  },
  title: {
    textAlign: "center",
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.s,
  },
  subtitle: {
    textAlign: "center",
    paddingHorizontal: theme.spacing.m,
    lineHeight: 24,
  },
  form: {
    width: "100%",
    maxWidth: 450,
    alignSelf: "center",
  },
  inputGroup: {
    marginBottom: theme.spacing.l,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.secondary,
    marginBottom: theme.spacing.s,
  },
  inputContainer: {
    position: "relative",
  },
  textInput: {
    width: "100%",
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: theme.colors.inputBackground,
    borderWidth: 1,
    borderColor: "transparent",
    borderRadius: theme.borderRadius.s,
    color: theme.colors.secondary,
    height: 52,
    marginVertical: 0,
    marginBottom: 0,
    paddingLeft: 16,
    paddingRight: 16,
  },
  textInputWithIcon: {
    paddingRight: 48,
  },
  eyeIcon: {
    position: "absolute",
    right: 16,
    top: "50%",
    transform: [{ translateY: -12 }],
  },
  errorContainer: {
    backgroundColor: theme.colors.red1,
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.s,
    marginBottom: theme.spacing.l,
  },
  errorText: {
    color: theme.colors.error,
    marginTop: 4,
  },
  submitButton: {
    marginTop: theme.spacing.l,
    paddingVertical: 16,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: theme.borderRadius.s,
    ...theme.shadows.soft,
  },
  submitButtonDisabled: {
    backgroundColor: theme.colors.disabled,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: theme.spacing.xxl,
    paddingTop: theme.spacing.l,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  linkText: {
    color: theme.colors.primary,
  },
});

export default LoginPage;
