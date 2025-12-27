import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useNavigate } from "react-router-native";
import { MaterialIcons } from "@expo/vector-icons";
import theme from "../../theme";
import StyledText from "../../styles/StyledText";
import Animated, { FadeInDown } from "react-native-reanimated";

const SignupPage = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("comprador");

  return (
    <>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Animated.View
          style={styles.container}
          entering={FadeInDown.duration(1000)}
        >
          {/* Header con logo */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigate("/login", { replace: true })}>
              <Image
                resizeMode="contain"
                source={require("../../../public/suplaier_logo_celeste.png")}
                style={styles.logo}
              />
            </TouchableOpacity>
            <StyledText
              fontWeight="bold"
              fontSize="title"
              style={styles.title}
            >
              Crea tu cuenta gratuita
            </StyledText>
            <StyledText
              color="textGray"
              fontSize="body"
              style={styles.subtitle}
            >
              Completa tus datos para comenzar a operar
            </StyledText>
          </View>

          {/* Toggle de rol */}
          <View style={styles.roleSelector}>
            <TouchableOpacity
              style={[
                styles.roleButton,
                role === "comprador" && styles.roleButtonActive,
              ]}
              onPress={() => setRole("comprador")}
            >
              <MaterialIcons
                name="shopping-bag"
                size={24}
                color={role === "comprador" ? theme.colors.primary : theme.colors.textGray}
              />
              <StyledText
                fontSize="body"
                fontWeight={role === "comprador" ? "bold" : "normal"}
                style={[
                  styles.roleButtonText,
                  role === "comprador" && styles.roleButtonTextActive,
                ]}
              >
                Comprador
              </StyledText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.roleButton,
                role === "proveedor" && styles.roleButtonActive,
              ]}
              onPress={() => setRole("proveedor")}
            >
              <MaterialIcons
                name="storefront"
                size={24}
                color={role === "proveedor" ? theme.colors.primary : theme.colors.textGray}
              />
              <StyledText
                fontSize="body"
                fontWeight={role === "proveedor" ? "bold" : "normal"}
                style={[
                  styles.roleButtonText,
                  role === "proveedor" && styles.roleButtonTextActive,
                ]}
              >
                Proveedor
              </StyledText>
            </TouchableOpacity>
          </View>

          {/* Botón para continuar al formulario */}
          <TouchableOpacity
            style={styles.continueButton}
            onPress={() => {
              if (role === "comprador") {
                navigate("/signup_comprador", { replace: true });
              } else {
                navigate("/signup_proveedor", { replace: true });
              }
            }}
          >
            <StyledText
              fontSize="subheading"
              color="secondary"
              fontWeight="bold"
            >
              CONTINUAR
            </StyledText>
          </TouchableOpacity>

          {/* Footer */}
          <View style={styles.footer}>
            <StyledText fontSize="body" color="textGray">
              ¿Ya tienes una cuenta?{" "}
            </StyledText>
            <TouchableOpacity
              onPress={() => {
                navigate("/login", {
                  replace: true,
                });
              }}
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
  roleSelector: {
    flexDirection: "row",
    marginBottom: theme.spacing.xxl,
    borderRadius: theme.borderRadius.s,
    backgroundColor: theme.colors.backgroundLight,
    padding: 4,
  },
  roleButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: theme.borderRadius.s,
    gap: 8,
  },
  roleButtonActive: {
    backgroundColor: theme.colors.background,
    ...theme.shadows.soft,
  },
  roleButtonText: {
    color: theme.colors.textGray,
  },
  roleButtonTextActive: {
    color: theme.colors.primary,
  },
  continueButton: {
    marginTop: theme.spacing.l,
    paddingVertical: 16,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: theme.borderRadius.s,
    ...theme.shadows.soft,
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

export default SignupPage;

