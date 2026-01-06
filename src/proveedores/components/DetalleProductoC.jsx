import React, { useState } from "react";
import { View, Image, Modal, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { StarsQualification } from "../../proveedores/components/StarsQualification";
import { ButtonWithText } from "../../proveedores/components/ButtonWithText";
import { Ionicons } from "@expo/vector-icons";
import ProgressBar from "react-native-progress/Bar";

import StyledText from "../../styles/StyledText";
import theme from "../../theme";
import { dateOptions } from "../../components/dateOptions";
import { EtiquetaEstadoOferta } from "../../components/EtiquetaEstadoOferta";
import { UnirseOfertaModal } from "./UnirseOfertaModal";

export const DetalleProductoC = ({ isvisible, onclose, dataproducto }) => {
  const [isvisibleUnirseoferta, setisvisibleUnirseoferta] = useState(false);
  const fechaLimiteObj = new Date(dataproducto?.fechaLimiteObj ?? "");

  const validarValoracion = (valor) => {
    const valorEntero = Math.floor(valor);
    return Math.min(Math.max(valorEntero, 1), 5);
  };

  const calificacion = validarValoracion(
    dataproducto?.producto?.Valoracion ?? 1
  );

  const progreso = dataproducto?.progresoDemanda || 0;
  const unidadesRestantes = (dataproducto?.Maximo || 0) - (dataproducto?.actualProductos || 0);
  const unidadesMinRestantes = (dataproducto?.Minimo || 0) - (dataproducto?.actualProductos || 0);

  return (
    <Modal visible={isvisible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View style={styles.header}>
              <StyledText style={styles.headerTitle}>
                Detalle de Demanda
              </StyledText>
              <TouchableOpacity onPress={onclose} style={styles.closeButton}>
                <Ionicons name="close" size={28} color="#6b7280" />
              </TouchableOpacity>
            </View>

            {/* Estado */}
            <View style={styles.statusContainer}>
              {dataproducto?.estadoDemanda?.Descripcion === "Cerrado" ? (
                <EtiquetaEstadoOferta estado="Verificando pagos" />
              ) : (
                <EtiquetaEstadoOferta estado={dataproducto?.estadoDemanda?.Descripcion} />
              )}
            </View>

            {/* Imagen y nombre del producto */}
            <View style={styles.productSection}>
              <Image
                source={
                  dataproducto?.datosProd?.urlImg != null &&
                  dataproducto?.datosProd?.urlImg != "no-img.jpeg"
                    ? {
                        uri: dataproducto?.datosProd?.urlImg ?? "",
                      }
                    : require("../../../public/no-img.jpeg")
                }
                style={styles.productImage}
              />
              <StyledText style={styles.productTitle}>
                {dataproducto?.datosProd?.nombreProd ?? ""}
              </StyledText>
              <View style={styles.ratingSection}>
                <StarsQualification calificacion={calificacion} />
              </View>
            </View>

            {/* Descripción del producto */}
            <View style={styles.section}>
              <StyledText style={styles.sectionTitle}>Descripción</StyledText>
              <View style={styles.infoCard}>
                <StyledText style={styles.description}>
                  {dataproducto?.producto?.Descripcion || dataproducto?.props?.Descripcion || "Sin descripción disponible"}
                </StyledText>
              </View>
            </View>

            {/* Información del comprador */}
            <View style={styles.section}>
              <StyledText style={styles.sectionTitle}>Comprador</StyledText>
              <View style={styles.infoCard}>
                <StyledText style={styles.infoValue}>
                  {dataproducto?.nombreComprador ?? ""}
                </StyledText>
              </View>
            </View>

            {/* Precios destacados */}
            <View style={styles.section}>
              <StyledText style={styles.sectionTitle}>Presupuesto</StyledText>
              <View style={styles.pricesGrid}>
                <View style={styles.priceCard}>
                  <StyledText style={styles.priceLabel}>Precio Mínimo</StyledText>
                  <StyledText style={styles.priceValue}>
                    ${dataproducto?.datosProd?.precioMin || 0}
                  </StyledText>
                </View>
                <View style={styles.priceCard}>
                  <StyledText style={styles.priceLabel}>Precio Máximo</StyledText>
                  <StyledText style={styles.priceValue}>
                    ${dataproducto?.datosProd?.precioMax || 0}
                  </StyledText>
                </View>
              </View>
            </View>

            {/* Información de cantidades */}
            <View style={styles.section}>
              <StyledText style={styles.sectionTitle}>Cantidades</StyledText>
              <View style={styles.quantitiesGrid}>
                <View style={styles.quantityCard}>
                  <StyledText style={styles.quantityLabel}>Se demanda</StyledText>
                  <StyledText style={styles.quantityValue}>
                    {dataproducto?.Maximo || 0}
                  </StyledText>
                </View>
                <View style={styles.quantityCard}>
                  <StyledText style={styles.quantityLabel}>Actual</StyledText>
                  <StyledText style={styles.quantityValue}>
                    {dataproducto?.actualProductos || 0} / {dataproducto?.Maximo || 0}
                  </StyledText>
                </View>
              </View>
              
              {/* Barra de progreso */}
              <View style={styles.progressSection}>
                <ProgressBar
                  progress={progreso}
                  width={null}
                  height={8}
                  color="#10b981"
                  unfilledColor="#e5e7eb"
                  borderWidth={0}
                  borderRadius={4}
                  style={styles.progressBar}
                />
                <StyledText style={styles.progressText}>
                  {Math.round(progreso * 100)}% completado
                </StyledText>
              </View>

              {unidadesMinRestantes > 0 && (
                <View style={styles.alertCard}>
                  <Ionicons name="information-circle" size={20} color="#2563eb" />
                  <StyledText style={styles.alertText}>
                    Unidades restantes para el mínimo: {unidadesMinRestantes}
                  </StyledText>
                </View>
              )}
            </View>

            {/* Fecha de vigencia */}
            <View style={styles.section}>
              <StyledText style={styles.sectionTitle}>Fecha Vigencia</StyledText>
              <View style={styles.infoCard}>
                <Ionicons name="calendar-outline" size={20} color="#6b7280" />
                <StyledText style={styles.dateText}>
                  {fechaLimiteObj.toLocaleString(undefined, dateOptions)}
                </StyledText>
              </View>
            </View>

            {/* Botón de acción */}
            {!dataproducto?.estaUnido && (
              <View style={styles.actionSection}>
                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={() => setisvisibleUnirseoferta(true)}
                  activeOpacity={0.8}
                >
                  <StyledText style={styles.primaryButtonText}>
                    CREAR PROPUESTA
                  </StyledText>
                </TouchableOpacity>
              </View>
            )}

            {/* Información de orden si ya está unido */}
            {dataproducto?.estaUnido && (
              <View style={styles.section}>
                <StyledText style={styles.sectionTitle}>Tu Orden de Compra</StyledText>
                <View style={styles.orderCard}>
                  <View style={styles.orderRow}>
                    <StyledText style={styles.orderLabel}>Fecha:</StyledText>
                    <StyledText style={styles.orderValue}>
                      {fechaLimiteObj.toLocaleString(undefined, dateOptions)}
                    </StyledText>
                  </View>
                  <View style={styles.orderRow}>
                    <StyledText style={styles.orderLabel}>Unidades adquiridas:</StyledText>
                    <StyledText style={styles.orderValue}>2</StyledText>
                  </View>
                  <View style={styles.orderRow}>
                    <StyledText style={styles.orderLabel}>Total pagado:</StyledText>
                    <StyledText style={styles.orderValue}>
                      ${dataproducto?.datosProd?.costoU * 2}
                    </StyledText>
                  </View>
                  <View style={styles.orderRow}>
                    <StyledText style={styles.orderLabel}>Estado:</StyledText>
                    <StyledText style={[styles.orderValue, styles.orderStatus]}>
                      {dataproducto?.estadoOferta?.Descripcion ?? ""}
                    </StyledText>
                  </View>
                </View>
              </View>
            )}

            <View style={styles.bottomSpacing} />
          </ScrollView>

          {/* Modal de unirse */}
          <UnirseOfertaModal
            dataproducto={dataproducto}
            isvisibleUnirseOfertaModal={isvisibleUnirseoferta}
            oncloseUnirseOferta={() => setisvisibleUnirseoferta(false)}
            onclopagado={() => {
              setisvisibleUnirseoferta(false);
              onclose();
            }}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "90%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },
  closeButton: {
    padding: 4,
  },
  statusContainer: {
    padding: 20,
    paddingTop: 12,
    paddingBottom: 0,
  },
  productSection: {
    padding: 20,
    alignItems: "center",
  },
  productImage: {
    width: "100%",
    height: 200,
    resizeMode: "contain",
    marginBottom: 16,
  },
  productTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
    marginBottom: 12,
  },
  ratingSection: {
    marginBottom: 8,
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: "#f9fafb",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  infoValue: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "500",
    flex: 1,
  },
  description: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 20,
  },
  pricesGrid: {
    flexDirection: "row",
    gap: 12,
  },
  priceCard: {
    flex: 1,
    backgroundColor: "#eff6ff",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#bfdbfe",
  },
  priceLabel: {
    fontSize: 12,
    color: "#1e40af",
    fontWeight: "600",
    marginBottom: 4,
  },
  priceValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2563eb",
  },
  quantitiesGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  quantityCard: {
    flex: 1,
    backgroundColor: "#f9fafb",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  quantityLabel: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "500",
    marginBottom: 4,
  },
  quantityValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  progressSection: {
    marginBottom: 16,
  },
  progressBar: {
    width: "100%",
    marginBottom: 8,
  },
  progressText: {
    fontSize: 12,
    color: "#6b7280",
    textAlign: "center",
  },
  alertCard: {
    backgroundColor: "#eff6ff",
    padding: 12,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  alertText: {
    fontSize: 13,
    color: "#1e40af",
    fontWeight: "600",
    flex: 1,
  },
  dateText: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "500",
    flex: 1,
  },
  actionSection: {
    padding: 20,
    paddingTop: 12,
  },
  primaryButton: {
    backgroundColor: "#2563eb",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#2563eb",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 0.5,
  },
  orderCard: {
    backgroundColor: "#f9fafb",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  orderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  orderLabel: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "500",
  },
  orderValue: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "600",
  },
  orderStatus: {
    color: "#10b981",
  },
  bottomSpacing: {
    height: 40,
  },
});
