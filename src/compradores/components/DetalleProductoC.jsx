import React, { useMemo, useState } from "react";
import {
  View,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
} from "react-native";
import { StarsQualification } from "../../proveedores/components/StarsQualification";
import ProgressBar from "react-native-progress/Bar";
import StyledText from "../../styles/StyledText";
import theme from "../../theme";
import { UnirseOfertaModal } from "./UnirseOfertaModal";
import { UnirseOfertaAhoraModal } from "./UnirseOfertaAhoraModal";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// Fallbacks por si theme viene mal (o undefined)
const COLOR_AZUL = theme?.colors?.blue ?? "#2563EB";
const COLOR_MORADO = theme?.colors?.purple ?? "#7B2CBF";
const COLOR_GRIS = theme?.colors?.gray2 ?? "#E5E7EB";

export const DetalleProductoC = ({ isvisible, onclose, dataproducto }) => {
  const [isvisibleUnirseOfertaAhoraModal, setisvisibleUnirseOfertaAhoraModal] =
    useState(false);
  const [isvisibleUnirseoferta, setisvisibleUnirseoferta] = useState(false);

  const fechaLimiteObj = useMemo(() => {
    const f = dataproducto?.fechaLimiteObj ?? dataproducto?.props?.FechaLimite;
    const d = f ? new Date(f) : new Date();
    return isNaN(d.getTime()) ? new Date() : d;
  }, [dataproducto]);

  const validarValoracion = (valor) => {
    const n = Number(valor);
    if (!Number.isFinite(n)) return 1;
    return Math.min(Math.max(Math.floor(n), 1), 5);
  };

  const calificacion = useMemo(() => {
    const raw =
      dataproducto?.producto?.Valoracion ??
      dataproducto?.producto?.Rating ??
      1;
    return validarValoracion(raw);
  }, [dataproducto]);

  const descripcion = useMemo(() => {
    return (
      dataproducto?.producto?.Descripcion ||
      dataproducto?.producto?.Description ||
      dataproducto?.props?.Descripcion ||
      dataproducto?.props?.Description ||
      ""
    );
  }, [dataproducto]);

  const maximo = useMemo(() => {
    const m = Number(dataproducto?.Maximo ?? dataproducto?.props?.Maximo ?? 0);
    return Number.isFinite(m) ? m : 0;
  }, [dataproducto]);

  const actualProductos = useMemo(() => {
    const a = Number(
      dataproducto?.actualProductos ?? dataproducto?.props?.ActualProductos ?? 0
    );
    return Number.isFinite(a) ? a : 0;
  }, [dataproducto]);

  const minimo = useMemo(() => {
    const mi = Number(dataproducto?.Minimo ?? dataproducto?.props?.Minimo ?? 0);
    return Number.isFinite(mi) ? mi : 0;
  }, [dataproducto]);

  const unidadesRestantes = useMemo(() => {
    const rest = maximo - actualProductos;
    return rest < 0 ? 0 : rest;
  }, [maximo, actualProductos]);

  const progreso01 = useMemo(() => {
    const p = Number(dataproducto?.progresoOferta ?? 0);
    if (!Number.isFinite(p)) return 0;
    return Math.min(Math.max(p, 0), 1);
  }, [dataproducto]);

  const progresoPercentaje = Math.round(progreso01 * 100);

  const costoU = Number(dataproducto?.datosProd?.costoU ?? 0) || 0;
  const costoInst = Number(dataproducto?.datosProd?.costoInst ?? 0) || 0;

  // Ancho real para que la barra no se “corte”
  const PROGRESS_WIDTH = Math.max(0, SCREEN_WIDTH - 32 - 32); // 32 padding mainInfo + 32 padding card

  return (
    <Modal
      visible={!!isvisible}
      transparent
      animationType="slide"
      onRequestClose={onclose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerContent}>
                <StyledText fontWeight="bold" style={styles.headerTitle}>
                  {dataproducto?.datosProd?.nombreProd ?? ""}
                </StyledText>

                <TouchableOpacity onPress={onclose} style={styles.closeButton}>
                  <StyledText style={styles.closeIcon}>✕</StyledText>
                </TouchableOpacity>
              </View>

              {/* Badge */}
              <View style={styles.badgeContainer}>
                <View
                  style={[
                    styles.badge,
                    dataproducto?.estaUnido && styles.badgeUnido,
                  ]}
                >
                  <StyledText
                    style={[
                      styles.badgeText,
                      dataproducto?.estaUnido && styles.badgeTextUnido,
                    ]}
                  >
                    {dataproducto?.estaUnido
                      ? "✓ Ya estás unido"
                      : "🔥 En curso"}
                  </StyledText>
                </View>
              </View>
            </View>

            {/* Imagen */}
            <View style={styles.imageSection}>
              <Image
                source={
                  dataproducto?.datosProd?.urlImg != null &&
                  dataproducto?.datosProd?.urlImg !== "no-img.jpeg"
                    ? { uri: dataproducto?.datosProd?.urlImg ?? "" }
                    : require("../../../public/no-img.jpeg")
                }
                style={styles.productImage}
              />
              <View style={styles.starsBox}>
                <StarsQualification calificacion={calificacion} />
              </View>
            </View>

            {/* Info */}
            <View style={styles.mainInfo}>
              <View style={styles.infoCard}>
                <View style={styles.infoRow}>
                  <StyledText style={styles.infoLabel}>👤 Proveedor:</StyledText>
                  <StyledText style={styles.infoValue} fontWeight="bold">
                    {dataproducto?.nombreProveedor ?? ""}
                  </StyledText>
                </View>
              </View>

              <View style={styles.priceGrid}>
                <View style={styles.priceCard}>
                  <StyledText style={styles.priceLabel}>
                    Precio Unitario
                  </StyledText>
                  <StyledText style={styles.priceValue} fontWeight="bold">
                    ${costoU}
                  </StyledText>
                </View>

                {costoInst > 0 && (
                  <View style={[styles.priceCard, styles.priceInstantCard]}>
                    <StyledText style={styles.priceLabel}>
                      ⚡ Instantáneo
                    </StyledText>
                    <StyledText
                      style={[styles.priceValue, styles.priceInstant]}
                      fontWeight="bold"
                    >
                      ${costoInst}
                    </StyledText>
                  </View>
                )}
              </View>

              <View style={styles.detailsGrid}>
                <View style={styles.detailCard}>
                  <StyledText style={styles.detailIcon}>📦</StyledText>
                  <StyledText style={styles.detailLabel}>Disponibles</StyledText>
                  <StyledText style={styles.detailValue} fontWeight="bold">
                    {unidadesRestantes}/{maximo}
                  </StyledText>
                </View>

                <View style={styles.detailCard}>
                  <StyledText style={styles.detailIcon}>📅</StyledText>
                  <StyledText style={styles.detailLabel}>Cierre</StyledText>
                  <StyledText style={styles.detailValue} fontWeight="bold">
                    {fechaLimiteObj.toLocaleDateString()}
                  </StyledText>
                </View>
              </View>

              {!!descripcion && (
                <View style={styles.descriptionCard}>
                  <StyledText style={styles.sectionTitle} fontWeight="bold">
                    📝 Descripción
                  </StyledText>
                  <StyledText style={styles.descriptionText}>
                    {descripcion}
                  </StyledText>
                </View>
              )}

              {/* Progreso */}
              <View style={styles.progressCard}>
                <View style={styles.progressHeader}>
                  <StyledText fontWeight="bold">Progreso de la oferta</StyledText>
                  <StyledText fontWeight="bold" style={styles.progressPercentage}>
                    {progresoPercentaje}%
                  </StyledText>
                </View>

                <ProgressBar
                  progress={progreso01}
                  width={PROGRESS_WIDTH}
                  height={14}
                  borderRadius={8}
                  borderWidth={0}
                  color={COLOR_AZUL}
                  unfilledColor={COLOR_GRIS}
                />

                {minimo > actualProductos && (
                  <View style={styles.minAlert}>
                    <StyledText style={styles.minAlertText}>
                      ⚠️ Faltan {minimo - actualProductos} unidades para completar el mínimo
                    </StyledText>
                  </View>
                )}
              </View>
            </View>

            {/* Botones */}
            {!dataproducto?.estaUnido ? (
              <View style={styles.actionsContainer}>
                <TouchableOpacity
                  style={styles.primaryButton}
                  activeOpacity={0.85}
                  onPress={() => setisvisibleUnirseoferta(true)}
                >
                  <Text style={styles.primaryButtonText}>🛒 Unirse a la oferta</Text>
                </TouchableOpacity>

                {costoInst > 0 && (
                  <TouchableOpacity
                    style={styles.secondaryButton}
                    activeOpacity={0.85}
                    onPress={() => setisvisibleUnirseOfertaAhoraModal(true)}
                  >
                    <Text style={styles.secondaryButtonText}>⚡ Comprar ahora</Text>
                  </TouchableOpacity>
                )}
              </View>
            ) : null}
          </ScrollView>

          {/* Modales */}
          <UnirseOfertaModal
            dataproducto={dataproducto}
            isvisibleUnirseOfertaModal={isvisibleUnirseoferta}
            oncloseUnirseOferta={() => setisvisibleUnirseoferta(false)}
            onclopagado={() => {
              setisvisibleUnirseoferta(false);
              onclose();
            }}
          />

          <UnirseOfertaAhoraModal
            dataproducto={dataproducto}
            isvisibleUnirseOfertaAhoraModal={isvisibleUnirseOfertaAhoraModal}
            oncloseUnirseOfertaAhora={() =>
              setisvisibleUnirseOfertaAhoraModal(false)
            }
            oncloseexito={() => {
              setisvisibleUnirseOfertaAhoraModal(false);
              onclose();
            }}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  container: {
    backgroundColor: "#f8f9fa",
    height: "95%",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    overflow: "hidden",
  },

  header: {
    backgroundColor: "#9434DB",
    paddingTop: 20,
    paddingBottom: 15,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    flex: 1,
    marginRight: 10,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  closeIcon: { color: "#fff", fontSize: 24, fontWeight: "bold" },

  badgeContainer: { marginTop: 10 },
  badge: {
    backgroundColor: "rgba(255,255,255,0.9)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  badgeUnido: { backgroundColor: "#4caf50" },
  badgeText: { fontSize: 12, fontWeight: "700", color: "#7B2CBF" },
  badgeTextUnido: { color: "#fff" },

  imageSection: { backgroundColor: "#fff", padding: 20, alignItems: "center" },
  productImage: { width: 250, height: 250, resizeMode: "contain", marginBottom: 10 },
  starsBox: { marginTop: 10 },

  mainInfo: { padding: 16 },

  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
  },
  infoRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  infoLabel: { fontSize: 14, color: "#666" },
  infoValue: { fontSize: 16, color: COLOR_MORADO },

  priceGrid: { flexDirection: "row", gap: 12, marginBottom: 12 },
  priceCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    elevation: 3,
  },
  priceInstantCard: { borderWidth: 2, borderColor: "#ff9800" },
  priceLabel: { fontSize: 12, color: "#666", marginBottom: 6 },
  priceValue: { fontSize: 24, color: COLOR_MORADO },
  priceInstant: { color: "#ff9800" },

  detailsGrid: { flexDirection: "row", gap: 12, marginBottom: 12 },
  detailCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    elevation: 3,
  },
  detailIcon: { fontSize: 28, marginBottom: 8 },
  detailLabel: { fontSize: 12, color: "#666", marginBottom: 4 },
  detailValue: { fontSize: 16, color: COLOR_MORADO },

  descriptionCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
  },
  sectionTitle: { fontSize: 16, color: COLOR_MORADO, marginBottom: 8 },
  descriptionText: { fontSize: 14, color: "#666", lineHeight: 20 },

  progressCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
  },
  progressHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  progressPercentage: { color: COLOR_AZUL, fontSize: 18 },

  minAlert: {
    marginTop: 12,
    backgroundColor: "#fff3cd",
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#ffc107",
  },
  minAlertText: { fontSize: 13, color: "#856404" },

  actionsContainer: { padding: 16, gap: 12, paddingBottom: 32 },

  primaryButton: {
    backgroundColor: COLOR_AZUL,
    borderRadius: 12,
    minHeight: 54,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 18,
    elevation: 6,
  },
  primaryButtonText: { color: "#fff", fontSize: 16, fontWeight: "700" },

  secondaryButton: {
    backgroundColor: "#ff9800",
    borderRadius: 12,
    minHeight: 54,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 18,
    elevation: 6,
  },
  secondaryButtonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
