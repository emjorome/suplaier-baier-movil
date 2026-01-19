import {
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useNavigate } from "react-router-native";
import { apiUrl } from "../../../apiUrl";
import theme from "../../theme";
import StyledText from "../../styles/StyledText";
import StyledTextInput from "../../styles/StyledTextInput";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Picker } from "@react-native-picker/picker";
import { getProvincias, getCantones } from "../../data/provincias";
import UploadImage from "../../styles/UploadImage";
import { useReward } from "../../context/RewardContext";

// ⭐ SONARQUBE FIX: Props validation
FormikInputValue.propTypes = {
  name: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  isPassword: PropTypes.bool,
  hidePassword: PropTypes.bool,
  setHidePassword: PropTypes.func,
  isDropDown: PropTypes.bool,
};

const RegistroCompradorPage = () => {
  const navigate = useNavigate();
  const { setReward } = useReward();
  const [hidePassword, setHidePassword] = useState(true);
  const [hidePasswordConf, setHidePasswordConf] = useState(true);
  const [loading, setLoading] = useState(false);
  const [imageUri, setImageUri] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    IdRol: 1,
    Nombre: "",
    Identificacion: "",
    Usuario: "",
    Contrasena: "",
    ContrasenaConf: "",
    Email: "",
    Numero: "",
    Pais: "Ecuador",
    Provincia: "",
    Ciudad: "",
    Direccion: "",
    TipoId: "Cédula",
    CodigoInvitacion: "",
  });

  // Validation states
  const [errors, setErrors] = useState({});

  // Provincias y ciudades
  const provincias = getProvincias();
  const [ciudades, setCiudades] = useState([]);

  // Efecto para actualizar ciudades cuando cambia la provincia
  useEffect(() => {
    if (formData.Provincia) {
      const cantones = getCantones(formData.Provincia);
      setCiudades(cantones);
      // Limpiar ciudad si la provincia cambió
      if (formData.Ciudad && !cantones.includes(formData.Ciudad)) {
        setFormData({ ...formData, Ciudad: "" });
      }
    } else {
      setCiudades([]);
      setFormData({ ...formData, Ciudad: "" });
    }
  }, [formData.Provincia]);

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
    // Limpiar error cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const validateForm = async () => {
    const newErrors = {};

    // Validar Usuario
    const regexUsername = /^[a-zA-Z0-9_]{3,30}$/;
    if (!formData.Usuario) {
      newErrors.Usuario = "Usuario es requerido";
    } else if (!regexUsername.test(formData.Usuario)) {
      newErrors.Usuario = "Usuario debe tener 3-30 caracteres (letras, números y _)";
    } else {
      // Verificar si el usuario ya existe
      try {
        const resp = await fetch(
          `${apiUrl}/validarusuario?username=${encodeURIComponent(formData.Usuario)}`
        );
        const data = await resp.json();
        if (data?.rows && data.rows.length > 0) {
          newErrors.Usuario = "Este usuario ya existe";
        }
      } catch (error) {
        console.error("Error validando usuario:", error);
      }
    }

    // Validar Nombre
    const regexNombre = /^[a-zA-ZàáąčćęèéįìíòóùúýźñçÀÁĄĆĘÈÉÌÍÒÓÙÚŲÝŹÑÇ']+[ -][a-zA-ZàáąčćęèéįìíòóùúýźñçÀÁĄĆĘÈÉÌÍÒÓÙÚŲÝŹÑÇ ,.'-]+$/;
    if (!formData.Nombre) {
      newErrors.Nombre = "Nombre es requerido";
    } else if (!regexNombre.test(formData.Nombre)) {
      newErrors.Nombre = "Nombre inválido";
    }

    // Validar Contraseña
    const regexContrasena = /^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,100}$/;
    if (!formData.Contrasena) {
      newErrors.Contrasena = "Contraseña es requerida";
    } else if (!regexContrasena.test(formData.Contrasena)) {
      newErrors.Contrasena = "Mínimo 8 caracteres, 1 número y 1 letra minúscula";
    }

    // Validar Confirmación de Contraseña
    if (formData.Contrasena !== formData.ContrasenaConf) {
      newErrors.ContrasenaConf = "Las contraseñas no coinciden";
    }

    // Validar Identificación
    const regexCedula = /^[0-9]{9}[-]?[0-9][-]?([0-9]{3})?$/;
    if (!formData.Identificacion) {
      newErrors.Identificacion = "Identificación es requerida";
    } else if (!regexCedula.test(formData.Identificacion)) {
      newErrors.Identificacion = "Formato de cédula inválido";
    }

    // Validar Email
    const regexEmail = /^\w+([-]?\w+)*@\w+([-]?\w+)*(.\w{2,3})+$/;
    if (!formData.Email) {
      newErrors.Email = "Email es requerido";
    } else if (!regexEmail.test(formData.Email)) {
      newErrors.Email = "Email inválido";
    }

    // Validar Número
    const regexNumero = /^[+]?[(]?[0-9]{3}[)]?[-\s]?[0-9]{3}[-\s]?[0-9]{4,6}$/im;
    if (!formData.Numero) {
      newErrors.Numero = "Número es requerido";
    } else if (!regexNumero.test(formData.Numero)) {
      newErrors.Numero = "Número inválido";
    }

    // Validar Provincia
    if (!formData.Provincia || formData.Provincia === "") {
      newErrors.Provincia = "Provincia es requerida";
    }

    // Validar Ciudad
    if (!formData.Ciudad) {
      newErrors.Ciudad = "Ciudad es requerida";
    }

    // Validar Dirección
    if (!formData.Direccion) {
      newErrors.Direccion = "Dirección es requerida";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      console.log("Validando formulario...");
      
      const isValid = await validateForm();
      
      if (!isValid) {
        console.log("Formulario inválido:", errors);
        Alert.alert("Error", "Por favor corrige los errores en el formulario");
        setLoading(false);
        return;
      }

      console.log("Enviando registro...");
      const { ContrasenaConf, CodigoInvitacion, ...payload } = formData;

      // Agregar imagen si existe
      if (imageUri) {
        payload.urlImg = imageUri;
      }

      const resp = await fetch(`${apiUrl}/usuarios`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      console.log("Respuesta status:", resp.status);
      const data = await resp.json();
      console.log("Respuesta data:", data);

      if (!resp.ok) {
        throw new Error(data.message || "Error al registrar usuario");
      }

      // Obtener el ID del usuario registrado
      const userId = data?.userId ?? data?.insertId ?? data?.rows?.[0]?.IdUsuario ?? null;
      console.log("Usuario registrado con ID:", userId);

      // Intentar canjear código de invitación si existe
      let rewardMostrado = false;
      const codigoRaw = (CodigoInvitacion || "").trim();

      if (userId && codigoRaw) {
        const code = codigoRaw.replace(/\s+/g, "").toUpperCase();
        console.log("Intentando canjear código:", code);
        
        try {
          const respCanje = await fetch(`${apiUrl}/recompensas/canjear-invitacion`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, code }),
          });
          
          const canje = await respCanje.json().catch(() => ({}));
          console.log("Respuesta de canje:", canje);

          if (canje?.ok || canje?.alreadyClaimed) {
            rewardMostrado = true;
            const stars = Number(canje?.award?.stars || 0);
            const msg = canje?.award?.message || 
              (canje?.alreadyClaimed 
                ? "Este código ya fue canjeado anteriormente." 
                : "Código canjeado con éxito.");

            setReward({
              title: canje?.alreadyClaimed ? "Código ya canjeado" : "¡Bienvenido!",
              message: msg,
              stars,
              balance: canje?.balance ?? null,
              onClose: () => {
                Alert.alert(
                  "¡Registro Exitoso!",
                  "Tu cuenta ha sido creada correctamente. Ahora puedes iniciar sesión.",
                  [
                    {
                      text: "Iniciar Sesión",
                      onPress: () => navigate("/login", { replace: true }),
                    },
                  ]
                );
              },
            });
          }
        } catch (err) {
          console.error("Error canjeando invitación:", err);
          // No bloqueamos el registro si falla el canje
        }
      }

      // Si no se mostró recompensa, mostrar mensaje de éxito normal
      if (!rewardMostrado) {
        Alert.alert(
          "¡Registro Exitoso!",
          "Tu cuenta ha sido creada correctamente. Ahora puedes iniciar sesión.",
          [
            {
              text: "Iniciar Sesión",
              onPress: () => navigate("/login", { replace: true }),
            },
          ]
        );
      }
    } catch (error) {
      console.error("Error en registro:", error);
      Alert.alert("Error", error.message || "No se pudo completar el registro");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Animated.View
          style={styles.container}
          entering={FadeInDown.duration(800)}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigate("/signup", { replace: true })}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color={theme.colors.primary} />
            </TouchableOpacity>
            <StyledText fontWeight="bold" fontSize="title" style={styles.title}>
              Registro de Comprador
        </StyledText>
            <StyledText color="textGray" fontSize="body" style={styles.subtitle}>
              Completa tus datos para crear tu cuenta
        </StyledText>
          </View>

          {/* Formulario */}
              <View style={styles.form}>
            {/* Usuario */}
            <View style={styles.inputGroup}>
              <StyledText style={styles.label}>
                Usuario <StyledText style={styles.required}>*</StyledText>
              </StyledText>
              <StyledTextInput
                placeholder="Ej. jrodriguez"
                value={formData.Usuario}
                onChangeText={(value) => handleInputChange("Usuario", value)}
                style={[styles.input, errors.Usuario && styles.inputError]}
                autoCapitalize="none"
              />
              {errors.Usuario && (
                <StyledText style={styles.errorText} fontSize="small">
                  {errors.Usuario}
                </StyledText>
              )}
            </View>

            {/* Nombre */}
            <View style={styles.inputGroup}>
              <StyledText style={styles.label}>
                Nombre <StyledText style={styles.required}>*</StyledText>
              </StyledText>
              <StyledTextInput
                placeholder="Ej. Juan Rodríguez"
                value={formData.Nombre}
                onChangeText={(value) => handleInputChange("Nombre", value)}
                style={[styles.input, errors.Nombre && styles.inputError]}
              />
              {errors.Nombre && (
                <StyledText style={styles.errorText} fontSize="small">
                  {errors.Nombre}
                </StyledText>
              )}
            </View>

            {/* Contraseña */}
            <View style={styles.inputGroup}>
              <StyledText style={styles.label}>
                Contraseña <StyledText style={styles.required}>*</StyledText>
              </StyledText>
              <View style={styles.passwordContainer}>
                <StyledTextInput
                  placeholder="••••••••"
                  value={formData.Contrasena}
                  onChangeText={(value) => handleInputChange("Contrasena", value)}
                  secureTextEntry={hidePassword}
                  style={[styles.input, styles.passwordInput, errors.Contrasena && styles.inputError]}
                />
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
              </View>
              {errors.Contrasena && (
                <StyledText style={styles.errorText} fontSize="small">
                  {errors.Contrasena}
                </StyledText>
              )}
            </View>

            {/* Confirmar Contraseña */}
            <View style={styles.inputGroup}>
              <StyledText style={styles.label}>
                Confirmar Contraseña <StyledText style={styles.required}>*</StyledText>
              </StyledText>
              <View style={styles.passwordContainer}>
                <StyledTextInput
                  placeholder="••••••••"
                  value={formData.ContrasenaConf}
                  onChangeText={(value) => handleInputChange("ContrasenaConf", value)}
                  secureTextEntry={hidePasswordConf}
                  style={[styles.input, styles.passwordInput, errors.ContrasenaConf && styles.inputError]}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setHidePasswordConf(!hidePasswordConf)}
                >
                  <Ionicons
                    name={hidePasswordConf ? "eye-off-outline" : "eye-outline"}
                    size={24}
                    color={theme.colors.gray1}
                  />
                </TouchableOpacity>
              </View>
              {errors.ContrasenaConf && (
                <StyledText style={styles.errorText} fontSize="small">
                  {errors.ContrasenaConf}
                </StyledText>
              )}
            </View>

            {/* Tipo ID y Cédula */}
            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 0.4 }]}>
                <StyledText style={styles.label}>
                  Tipo ID <StyledText style={styles.required}>*</StyledText>
                </StyledText>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={formData.TipoId}
                    onValueChange={(value) => handleInputChange("TipoId", value)}
                    style={styles.picker}
                  >
                    <Picker.Item label="Cédula" value="Cédula" />
                    <Picker.Item label="RUC" value="RUC" />
                  </Picker>
                </View>
              </View>

              <View style={[styles.inputGroup, { flex: 0.6 }]}>
                <StyledText style={styles.label}>
                  {formData.TipoId} <StyledText style={styles.required}>*</StyledText>
                </StyledText>
                <StyledTextInput
                  placeholder="099..."
                  value={formData.Identificacion}
                  onChangeText={(value) => handleInputChange("Identificacion", value)}
                  style={[styles.input, errors.Identificacion && styles.inputError]}
                  keyboardType="numeric"
                />
                {errors.Identificacion && (
                  <StyledText style={styles.errorText} fontSize="small">
                    {errors.Identificacion}
                  </StyledText>
                )}
              </View>
            </View>

            {/* Email */}
            <View style={styles.inputGroup}>
              <StyledText style={styles.label}>
                E-mail <StyledText style={styles.required}>*</StyledText>
              </StyledText>
              <StyledTextInput
                placeholder="ejemplo@correo.com"
                value={formData.Email}
                onChangeText={(value) => handleInputChange("Email", value)}
                style={[styles.input, errors.Email && styles.inputError]}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {errors.Email && (
                <StyledText style={styles.errorText} fontSize="small">
                  {errors.Email}
                </StyledText>
              )}
            </View>

            {/* Celular */}
            <View style={styles.inputGroup}>
              <StyledText style={styles.label}>
                Celular <StyledText style={styles.required}>*</StyledText>
              </StyledText>
              <StyledTextInput
                placeholder="099..."
                value={formData.Numero}
                onChangeText={(value) => handleInputChange("Numero", value)}
                style={[styles.input, errors.Numero && styles.inputError]}
                keyboardType="phone-pad"
              />
              {errors.Numero && (
                <StyledText style={styles.errorText} fontSize="small">
                  {errors.Numero}
                </StyledText>
              )}
            </View>

            {/* Provincia */}
            <View style={styles.inputGroup}>
              <StyledText style={styles.label}>
                Provincia <StyledText style={styles.required}>*</StyledText>
              </StyledText>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.Provincia}
                  onValueChange={(value) => handleInputChange("Provincia", value)}
                  style={styles.picker}
                >
                  <Picker.Item label="Seleccionar Provincia" value="" />
                  {provincias.map((prov) => (
                    <Picker.Item key={prov} label={prov} value={prov} />
                  ))}
                </Picker>
              </View>
              {errors.Provincia && (
                <StyledText style={styles.errorText} fontSize="small">
                  {errors.Provincia}
                </StyledText>
              )}
            </View>

            {/* Ciudad */}
            <View style={styles.inputGroup}>
              <StyledText style={styles.label}>
                Ciudad <StyledText style={styles.required}>*</StyledText>
              </StyledText>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.Ciudad}
                  onValueChange={(value) => handleInputChange("Ciudad", value)}
                  style={styles.picker}
                  enabled={ciudades.length > 0}
                >
                  <Picker.Item label="Seleccionar Ciudad" value="" />
                  {ciudades.map((ciudad) => (
                    <Picker.Item key={ciudad} label={ciudad} value={ciudad} />
                  ))}
                </Picker>
              </View>
              {errors.Ciudad && (
                <StyledText style={styles.errorText} fontSize="small">
                  {errors.Ciudad}
                </StyledText>
              )}
            </View>

            {/* Dirección */}
            <View style={styles.inputGroup}>
              <StyledText style={styles.label}>
                Dirección <StyledText style={styles.required}>*</StyledText>
              </StyledText>
              <StyledTextInput
                placeholder="Calle principal, número de casa, referencia..."
                value={formData.Direccion}
                onChangeText={(value) => handleInputChange("Direccion", value)}
                style={[styles.input, errors.Direccion && styles.inputError]}
                multiline
                numberOfLines={3}
                textAreaSize="descripcion"
              />
              {errors.Direccion && (
                <StyledText style={styles.errorText} fontSize="small">
                  {errors.Direccion}
                </StyledText>
              )}
            </View>

            {/* Código de Invitación (Opcional) */}
            <View style={styles.inputGroup}>
              <StyledText style={styles.label}>
                Código de invitación (Opcional)
              </StyledText>
              <StyledTextInput
                placeholder="Ej. PROMO2025"
                value={formData.CodigoInvitacion}
                onChangeText={(value) => handleInputChange("CodigoInvitacion", value)}
                style={styles.input}
                autoCapitalize="characters"
              />
            </View>

            {/* Foto de Perfil (Opcional) */}
            <View style={styles.inputGroup}>
              <StyledText style={styles.label}>
                Foto de Perfil (Opcional)
              </StyledText>
              <UploadImage setImageUri={setImageUri} />
            </View>

            {/* Botón Continuar */}
            <TouchableOpacity
              style={[styles.submitButton, loading && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={loading}
                >
                  <StyledText
                    fontSize="subheading"
                    color="secondary"
                    fontWeight="bold"
                  >
                {loading ? "REGISTRANDO..." : "CONTINUAR"}
                  </StyledText>
                </TouchableOpacity>

            {/* Footer */}
            <View style={styles.footer}>
              <StyledText fontSize="body" color="textGray">
                ¿Ya tienes una cuenta?{" "}
              </StyledText>
                <TouchableOpacity
                onPress={() => navigate("/login", { replace: true })}
                >
                  <StyledText
                  fontSize="body"
                  style={styles.linkText}
                    fontWeight="bold"
                  >
                  Inicia sesión
                  </StyledText>
                </TouchableOpacity>
              </View>
          </View>
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
    paddingVertical: theme.spacing.l,
  },
  header: {
    marginBottom: theme.spacing.l,
  },
  backButton: {
    marginBottom: theme.spacing.m,
  },
  title: {
    textAlign: "center",
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.s,
  },
  subtitle: {
    textAlign: "center",
    paddingHorizontal: theme.spacing.m,
    lineHeight: 22,
  },
  form: {
    width: "100%",
  },
  inputGroup: {
    marginBottom: theme.spacing.l,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.secondary,
    marginBottom: theme.spacing.s,
  },
  required: {
    color: theme.colors.error,
  },
  input: {
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
  },
  inputError: {
    borderColor: theme.colors.error,
  },
  passwordContainer: {
    position: "relative",
  },
  passwordInput: {
    paddingRight: 50,
  },
  eyeIcon: {
    position: "absolute",
    right: 16,
    top: 14,
  },
  row: {
    flexDirection: "row",
    gap: theme.spacing.m,
  },
  pickerContainer: {
    backgroundColor: theme.colors.inputBackground,
    borderRadius: theme.borderRadius.s,
    borderWidth: 1,
    borderColor: "transparent",
    overflow: "hidden",
  },
  picker: {
    height: 52,
    width: "100%",
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

export default RegistroCompradorPage;
