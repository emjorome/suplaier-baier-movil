import React, { useMemo, useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useNavigate } from "react-router-native";
import { AuthContext } from "../../auth/context/AuthContext.jsx";


// Ajusta si tu apiUrl se exporta diferente (default export, etc.)
import { apiUrl } from "../../../apiUrl";



const CanjearInvitacionPage = () => {
  const navigate = useNavigate();
  const { authState } = useContext(AuthContext);


  const [codigo, setCodigo] = useState("");
  const [loading, setLoading] = useState(false);

  const codigoTrim = useMemo(() => codigo.trim(), [codigo]);

  const handleCanjear = async () => {
    if (!codigoTrim) {
        Alert.alert("Código requerido", "Ingresa un código de invitación.");
        return;
    }

    setLoading(true);
    try {
        const idUsuario = authState?.user?.IdUsuario ?? null;

        if (!idUsuario) {
        Alert.alert("Sesión no encontrada", "Vuelve a iniciar sesión.");
        return;
        }

        const endpoint = `${apiUrl}/recompensas/canjear-invitacion`;
        const payload = { userId: idUsuario, code: codigoTrim };

        console.log("POST:", endpoint, payload);

        const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        });

        const data = await res.json().catch(() => null);
        console.log("STATUS:", res.status, "DATA:", data);

        if (!res.ok) {
        throw new Error(data?.message || `Error ${res.status}`);
        }

        const msg =
        data?.award?.message ||
        data?.message ||
        "Tu código fue canjeado correctamente.";

        // Si ya lo había canjeado, el backend devuelve alreadyClaimed: true
        Alert.alert("Resultado", msg);

        setCodigo("");
        navigate("/comprador/profile/information");
    } catch (err) {
        Alert.alert("No se pudo canjear", err?.message || "Ocurrió un error.");
    } finally {
        setLoading(false);
    }
    };


  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#0B1220" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Canjear invitación</Text>
        <Text style={styles.subtitle}>
          Ingresa el código de invitación para canjear la recompensa.
        </Text>

        <View style={styles.card}>
          <Text style={styles.label}>Código</Text>
          <TextInput
            value={codigo}
            onChangeText={setCodigo}
            placeholder="Ej: A1B2C3D4"
            placeholderTextColor="#7A8599"
            autoCapitalize="characters"
            autoCorrect={false}
            style={styles.input}
            editable={!loading}
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleCanjear}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <View style={styles.row}>
                <ActivityIndicator />
                <Text style={styles.buttonText}>Procesando...</Text>
              </View>
            ) : (
              <Text style={styles.buttonText}>Canjear</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigate(-1)}
            disabled={loading}
            style={styles.secondaryBtn}
          >
            <Text style={styles.secondaryText}>Volver</Text>
          </TouchableOpacity>

          <Text style={styles.hint}>
            Tip: Asegúrate de estar conectado a la misma red que el servidor si
            estás en entorno local.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default CanjearInvitacionPage;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 28,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "700",
    marginTop: 8,
  },
  subtitle: {
    color: "#B7C0D1",
    marginTop: 8,
    marginBottom: 16,
    lineHeight: 20,
  },
  card: {
    backgroundColor: "#111A2E",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#1E2A44",
  },
  label: {
    color: "#B7C0D1",
    marginBottom: 8,
    fontSize: 13,
  },
  input: {
    backgroundColor: "#0B1220",
    borderWidth: 1,
    borderColor: "#263551",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: "#FFFFFF",
    marginBottom: 14,
  },
  button: {
    backgroundColor: "#3B82F6",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 15,
    marginLeft: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  secondaryBtn: {
    marginTop: 12,
    paddingVertical: 10,
    alignItems: "center",
  },
  secondaryText: {
    color: "#B7C0D1",
    fontWeight: "600",
  },
  hint: {
    color: "#7A8599",
    fontSize: 12,
    marginTop: 12,
    lineHeight: 18,
  },
});
