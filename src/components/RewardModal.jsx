import React from "react";
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import StyledText from "../styles/StyledText";
import theme from "../theme";

const RewardModal = ({ visible, title, message, stars, balance, onClose }) => {
  const [scaleAnim] = React.useState(new Animated.Value(0));

  React.useEffect(() => {
    if (visible) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }).start();
    } else {
      scaleAnim.setValue(0);
    }
  }, [visible]);

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.container,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Header con icono de estrella */}
          <View style={styles.header}>
            <View style={styles.starContainer}>
              <Ionicons name="star" size={60} color={theme.colors.warning} />
            </View>
            <StyledText
              fontSize="title"
              fontWeight="bold"
              style={styles.title}
            >
              {title}
            </StyledText>
          </View>

          {/* Mensaje */}
          <View style={styles.content}>
            <StyledText
              fontSize="body"
              color="textGray"
              style={styles.message}
            >
              {message}
            </StyledText>

            {/* Estrellas ganadas */}
            {stars > 0 && (
              <View style={styles.starsBox}>
                <Ionicons
                  name="star"
                  size={24}
                  color={theme.colors.warning}
                />
                <StyledText
                  fontSize="heading"
                  fontWeight="bold"
                  style={styles.starsText}
                >
                  +{stars}
                </StyledText>
                <StyledText fontSize="body" color="textGray">
                  Estrellas
                </StyledText>
              </View>
            )}

            {/* Balance total */}
            {balance !== null && balance !== undefined && (
              <View style={styles.balanceBox}>
                <StyledText fontSize="small" color="textGray">
                  Saldo total:
                </StyledText>
                <View style={styles.balanceRow}>
                  <Ionicons
                    name="star"
                    size={16}
                    color={theme.colors.warning}
                  />
                  <StyledText
                    fontSize="subheading"
                    fontWeight="bold"
                    style={styles.balanceText}
                  >
                    {balance}
                  </StyledText>
                </View>
              </View>
            )}
          </View>

          {/* Botón de cerrar */}
          <TouchableOpacity style={styles.button} onPress={onClose}>
            <StyledText
              fontSize="subheading"
              fontWeight="bold"
              color="secondary"
            >
              CONTINUAR
            </StyledText>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.l,
  },
  container: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.m,
    padding: theme.spacing.xl,
    width: "100%",
    maxWidth: 400,
    ...theme.shadows.medium,
  },
  header: {
    alignItems: "center",
    marginBottom: theme.spacing.l,
  },
  starContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.backgroundLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing.m,
  },
  title: {
    textAlign: "center",
    color: theme.colors.textPrimary,
  },
  content: {
    alignItems: "center",
    marginBottom: theme.spacing.xl,
  },
  message: {
    textAlign: "center",
    lineHeight: 24,
    marginBottom: theme.spacing.l,
  },
  starsBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.s,
    backgroundColor: theme.colors.backgroundLight,
    paddingVertical: theme.spacing.m,
    paddingHorizontal: theme.spacing.l,
    borderRadius: theme.borderRadius.s,
    marginBottom: theme.spacing.m,
  },
  starsText: {
    color: theme.colors.warning,
  },
  balanceBox: {
    alignItems: "center",
    paddingTop: theme.spacing.m,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    width: "100%",
  },
  balanceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
    marginTop: theme.spacing.xs,
  },
  balanceText: {
    color: theme.colors.textPrimary,
  },
  button: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 16,
    borderRadius: theme.borderRadius.s,
    alignItems: "center",
    ...theme.shadows.soft,
  },
});

export default RewardModal;

