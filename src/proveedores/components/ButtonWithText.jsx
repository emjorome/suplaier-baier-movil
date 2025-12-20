import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { theme } from "../../theme";

export const ButtonWithText = ({
  anyfunction,
  title = "",
  color,
  colorTexto,
  icon = "",
  disabled = false,
  style,
  ...props
}) => {

  // Lógica de colores: Si está deshabilitado usa gris, si no, usa el color prop o el primario (Morado)
  const backgroundColor = disabled 
    ? theme.colors.disabled 
    : (color || theme.colors.primary);

  const textColor = colorTexto || theme.colors.textSecondary;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={anyfunction}
      disabled={disabled}
      style={[
        styles.button, 
        { 
          backgroundColor: backgroundColor,
          // Si tiene texto es redondeado (píldora), si es solo icono es más cuadrado
          borderRadius: title.length > 0 ? theme.borderRadius.m : theme.borderRadius.s,
        },
        style // Permite sobreescribir estilos desde fuera
      ]}
      {...props}
    >
      {/* Renderizado del Icono */}
      {icon.length > 0 && (
        <Icon 
          name={icon} 
          size={24} 
          color={textColor} 
          // Margen derecho solo si hay texto al lado
          style={{ marginRight: title.length > 0 ? theme.spacing.s : 0 }} 
        />
      )}

      {/* Renderizado del Texto */}
      {title.length > 0 && (
        <Text style={[styles.text, { color: textColor }]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    marginVertical: theme.spacing.m,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    flexDirection: "row",
    paddingVertical: theme.spacing.s,
    paddingHorizontal: theme.spacing.m,
    minWidth: 60,
    // Importamos la sombra estándar del tema
    ...theme.shadows.medium,
  },
  text: {
    fontSize: theme.fontSizes.body,
    fontWeight: theme.fontWeights.bold,
    textAlign: "center",
  }
});