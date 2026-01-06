import React from "react";
import { View, StyleSheet } from "react-native";
import StyledText from "../../styles/StyledText";
import theme from "../../theme";

/**
 * DashboardCard - Tarjeta de estadísticas para el dashboard del proveedor
 * Basado en el diseño de la web (DashboardCard.jsx)
 */
export const DashboardCard = ({ 
  title, 
  value, 
  subtitle, 
  icon, 
  color = "purple", 
  footerText, 
  footerColor = "default" 
}) => {
  
  const getColorStyles = () => {
    switch (color) {
      case "purple":
        return { backgroundColor: theme.colors.primary };
      case "blue":
        return { backgroundColor: theme.colors.lightblue };
      case "green":
        return { backgroundColor: theme.colors.green };
      case "orange":
        return { backgroundColor: theme.colors.warning };
      default:
        return { backgroundColor: theme.colors.primary };
    }
  };

  const getFooterColorStyles = () => {
    switch (footerColor) {
      case "green":
        return { color: theme.colors.green };
      case "yellow":
        return { color: theme.colors.warning };
      case "red":
        return { color: theme.colors.red };
      default:
        return { color: theme.colors.secondaryLight };
    }
  };

  return (
    <View style={[styles.card, theme.shadows.medium]}>
      {/* Header con icono y título */}
      <View style={[styles.header, getColorStyles()]}>
        <View style={styles.iconContainer}>
          {icon}
        </View>
        <StyledText 
          fontWeight="bold" 
          fontSize="subheading" 
          style={styles.title}
        >
          {title}
        </StyledText>
      </View>

      {/* Contenido con valor y subtítulo */}
      <View style={styles.content}>
        <StyledText 
          fontWeight="bold" 
          fontSize="bigTitle" 
          style={styles.value}
        >
          {value}
        </StyledText>
        <StyledText 
          fontSize="body" 
          style={styles.label}
        >
          {subtitle}
        </StyledText>
      </View>

      {/* Footer opcional con texto adicional */}
      {footerText && (
        <View style={styles.footer}>
          <StyledText 
            fontSize="small" 
            fontWeight="bold"
            style={[styles.footerText, getFooterColorStyles()]}
          >
            {footerText}
          </StyledText>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.m,
    overflow: "hidden",
    marginBottom: theme.spacing.m,
  },
  header: {
    padding: theme.spacing.l,
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.m,
  },
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: theme.colors.textSecondary,
    flex: 1,
  },
  content: {
    padding: theme.spacing.l,
    backgroundColor: theme.colors.background,
    alignItems: "center",
  },
  value: {
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  label: {
    color: theme.colors.secondaryLight,
    fontWeight: "500",
  },
  footer: {
    padding: theme.spacing.m,
    backgroundColor: `${theme.colors.primary}10`,
    minHeight: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {
    textAlign: "center",
  },
});

export default DashboardCard;

