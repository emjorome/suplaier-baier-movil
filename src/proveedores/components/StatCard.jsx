import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import StyledText from "../../styles/StyledText";
import Icon from "react-native-ico-material-design";
import theme from "../../theme";

/**
 * StatCard - Tarjeta de estadísticas moderna para el dashboard
 * Basado en el diseño stat-card de la web
 */
export const StatCard = ({ 
  iconName,
  iconColor = "blue",
  value, 
  label, 
  trend,
  trendColor = "green",
  onPress
}) => {
  
  const getIconBoxColor = () => {
    switch (iconColor) {
      case "blue":
        return { backgroundColor: "#eff6ff", color: "#3b82f6" };
      case "green":
        return { backgroundColor: "#ecfdf5", color: "#10b981" };
      case "orange":
        return { backgroundColor: "#fff7ed", color: "#f97316" };
      case "purple":
        return { backgroundColor: "#f5f3ff", color: "#8b5cf6" };
      default:
        return { backgroundColor: "#eff6ff", color: "#3b82f6" };
    }
  };

  const getTrendColor = () => {
    switch (trendColor) {
      case "green":
        return theme.colors.green;
      case "blue":
        return theme.colors.lightblue;
      case "red":
        return theme.colors.red;
      case "yellow":
        return theme.colors.warning;
      default:
        return theme.colors.green;
    }
  };

  const iconBoxStyles = getIconBoxColor();
  
  const CardContent = (
    <View style={[styles.card, theme.shadows.medium]}>
      {/* Top section con icono y flecha */}
      <View style={styles.top}>
        <View style={[styles.iconBox, { backgroundColor: iconBoxStyles.backgroundColor }]}>
          <Icon 
            name={iconName} 
            width={24} 
            height={24} 
            color={iconBoxStyles.color}
          />
        </View>
        <Icon 
          name="keyboard-right-arrow-button" 
          width={20} 
          height={20} 
          color="#9ca3af"
        />
      </View>

      {/* Valor principal */}
      <StyledText 
        style={styles.value}
      >
        {value}
      </StyledText>

      {/* Label */}
      <StyledText 
        style={styles.label}
      >
        {label}
      </StyledText>

      {/* Trend (opcional) */}
      {trend && (
        <StyledText 
          style={[styles.trend, { color: getTrendColor() }]}
        >
          {trend}
        </StyledText>
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity 
        style={styles.touchable} 
        onPress={onPress}
        activeOpacity={0.7}
      >
        {CardContent}
      </TouchableOpacity>
    );
  }

  return CardContent;
};

const styles = StyleSheet.create({
  touchable: {
    flex: 1,
    minWidth: 0,
  },
  card: {
    backgroundColor: theme.colors.background,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    minHeight: 160,
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 2,
  },
  top: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  iconBox: {
    width: 45,
    height: 45,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  value: {
    color: "#111827",
    fontSize: 28,
    fontWeight: "700",
    marginTop: 8,
    marginBottom: 2,
    lineHeight: 32,
  },
  label: {
    color: "#6b7280",
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
    lineHeight: 18,
  },
  trend: {
    fontSize: 12,
    fontWeight: "600",
    marginTop: 0,
    lineHeight: 16,
  },
});

export default StatCard;

