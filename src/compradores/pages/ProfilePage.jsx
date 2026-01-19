import React, { useContext } from "react";
import { StyleSheet, View, Image, ScrollView, Text, TouchableOpacity } from "react-native";
import StyledText from "../../styles/StyledText";
import { StatusBar } from "expo-status-bar";
import { AuthContext } from "../../auth/context/AuthContext.jsx";
import { useNavigate } from "react-router-native";

const ProfilePage = () => {
  const { authState } = useContext(AuthContext);
  const navigate = useNavigate();
  return (
    <ScrollView>
      <View style={styles.topContainer}>
        <StyledText style={styles.header}> MI PERFIL</StyledText>
        <StatusBar style="light" />
      </View>
      <View style={styles.container}>
        <View style={styles.profileContainer}>
          <Image
            source={
              authState.user.UrlLogoEmpresa != null &&
              authState.user.UrlLogoEmpresa != "no-img.jpeg"
                ? {
                    uri: authState.user.UrlLogoEmpresa,
                  }
                : require("../../../public/default-logo-comprador.png")
            }
            style={styles.profileImage}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Nombre:</Text>
          <Text style={styles.content}>{authState.user.Nombre}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Usuario:</Text>
          <Text style={styles.content}>{authState.user.Usuario}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Rol:</Text>
          <Text style={styles.content}>{authState.user.Rol}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Dirección:</Text>
          <Text style={styles.content}>{authState.user.Direccion}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Ciudad:</Text>
          <Text style={styles.content}>{authState.user.Ciudad}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Pais:</Text>
          <Text style={styles.content}>{authState.user.Pais}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Celular:</Text>
          <Text style={styles.content}>{authState.user.Numero}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Correo electrónico:</Text>
          <Text style={styles.content}>{authState.user.Email}</Text>
        </View>
        <TouchableOpacity
          style={styles.inviteButton}
          onPress={() => navigate("/comprador/canjearInvitacion")}
        >
          <Text style={styles.inviteButtonText}>Canjear invitación</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  topContainer: {
    paddingTop: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomColor: "gray", // Color de las líneas
    borderBottomWidth: 1, // Ancho de las líneas grises
    marginBottom: 10,
    paddingVertical: 5,
  },
  label: {
    fontWeight: "bold",
    fontSize: 16,
    width: "40%",
  },
  content: {
    fontSize: 16,
    width: "60%",
    marginLeft: 5,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    padding: 16,
    alignContent: "center",
    resizeMode: "center",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    justifyContent: "center",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
  inviteButton: {
    backgroundColor: "#3B82F6",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 24,
  },
  inviteButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});

export default ProfilePage;
