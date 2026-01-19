import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import StyledText from "../../styles/StyledText";
import Icon from "react-native-ico-material-design";
import theme from "../../theme";

/**
 * ActionCard - Tarjeta de acción rápida para el dashboard
 * Basado en el diseño action-card de la web
 */
export const ActionCard = ({ 
  iconName,
  iconColor = "blue",
  title, 
  description,
  onPress
}) => {
  
  const getIconCircleColor = () => {
    switch (iconColor) {
      case "green":
        return { backgroundColor: "#ecfdf5", color: "#10b981" };
      case "blue":
        return { backgroundColor: "#eff6ff", color: "#3b82f6" };
      case "gray":
        return { backgroundColor: "#f3f4f6", color: "#4b5563" };
      case "purple":
        return { backgroundColor: "#f5f3ff", color: "#8b5cf6" };
      case "orange":
        return { backgroundColor: "#fff7ed", color: "#f97316" };
      default:
        return { backgroundColor: "#eff6ff", color: "#3b82f6" };
    }
  };

  const iconCircleStyles = getIconCircleColor();

  return (
    <TouchableOpacity 
      style={[styles.card, theme.shadows.soft]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Icono circular */}
      <View style={[styles.iconCircle, { backgroundColor: iconCircleStyles.backgroundColor }]}>
        <Icon 
          name={iconName} 
          width={24} 
          height={24} 
          color={iconCircleStyles.color}
        />
      </View>

      {/* Título */}
      <StyledText 
        style={styles.title}
      >
        {title}
      </StyledText>

      {/* Descripción */}
      <StyledText 
        style={styles.description}
      >
        {description}
      </StyledText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.background,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    minHeight: 180,
    flex: 1,
    minWidth: 0,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 2,
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
    lineHeight: 20,
  },
  description: {
    color: "#6b7280",
    fontSize: 14,
    lineHeight: 19.6,
    fontWeight: "400",
  },
});

export default ActionCard;

