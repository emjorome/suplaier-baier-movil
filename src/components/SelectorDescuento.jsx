import React, { useState } from 'react';
import { View, Modal, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import StyledText from "../styles/StyledText";
import theme from '../theme';

export const SelectorDescuento = ({ 
  descuentos, 
  descuentoSeleccionado, 
  onSelectDescuento,
  montoOriginal 
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const calcularDescuento = (descuento) => {
    if (!descuento) return 0;
    const porcentaje = descuento.PorcentajeDescuento || descuento.Porcentaje || 0;
    return montoOriginal * (porcentaje / 100);
  };

    const renderDescuentoItem = ({ item }) => {
    const montoDescuento = calcularDescuento(item);
    const esSeleccionado = descuentoSeleccionado?.IdOpcion === item.IdOpcion;
    const noPuedeUsar = item.puedeUsar === false; // ✅ Nuevo

    return (
        <TouchableOpacity
        style={[
            styles.descuentoItem, 
            esSeleccionado && styles.descuentoSeleccionado,
            noPuedeUsar && styles.descuentoDeshabilitado // ✅ Nuevo
        ]}
        onPress={() => {
            onSelectDescuento(item);
            setModalVisible(false);
        }}
        disabled={noPuedeUsar} // ✅ Nuevo
        >
        <View style={styles.descuentoInfo}>
            <View style={styles.descuentoTexto}>
            <StyledText style={styles.descuentoNombre} fontWeight="bold">
                {item.Nombre || item.codigo}
            </StyledText>
            <StyledText style={styles.descuentoDescripcion}>
                {item.PorcentajeDescuento || item.Porcentaje}% de descuento • {item.CostoEstrellas}⭐
            </StyledText>
            {noPuedeUsar && ( // ✅ Nuevo
                <StyledText style={styles.descuentoNoDisponible}>
                ❌ Estrellas insuficientes
                </StyledText>
            )}
            {!noPuedeUsar && ( // ✅ Mostrar ahorro solo si puede usarlo
                <StyledText style={styles.descuentoMonto}>
                Ahorras: ${montoDescuento.toFixed(2)}
                </StyledText>
            )}
            </View>
        </View>
        {esSeleccionado && (
            <StyledText style={styles.checkIcon}>✓</StyledText>
        )}
        </TouchableOpacity>
    );
    };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.selectorButton}
        onPress={() => setModalVisible(true)}
      >
        <View style={styles.selectorContent}>
          <StyledText style={styles.iconText}>🎟️</StyledText>
          <StyledText style={styles.selectorText}>
            {descuentoSeleccionado 
              ? `${descuentoSeleccionado.Nombre || descuentoSeleccionado.codigo} aplicado` 
              : descuentos.length > 0 
                ? 'Seleccionar descuento' 
                : 'Sin descuentos disponibles'}
          </StyledText>
        </View>
        {descuentos.length > 0 && (
          <StyledText style={styles.arrowIcon}>›</StyledText>
        )}
      </TouchableOpacity>

      {descuentoSeleccionado && (
        <View style={styles.descuentoAplicado}>
          <StyledText style={styles.descuentoAplicadoTexto}>
            Descuento aplicado: -${calcularDescuento(descuentoSeleccionado).toFixed(2)}
          </StyledText>
          <TouchableOpacity onPress={() => onSelectDescuento(null)}>
            <StyledText style={styles.closeIcon}>✕</StyledText>
          </TouchableOpacity>
        </View>
      )}

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <StyledText fontWeight="bold" fontSize="subtitle">
                Seleccionar Descuento
              </StyledText>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <StyledText style={styles.closeButton}>✕</StyledText>
              </TouchableOpacity>
            </View>

            {descuentos.length === 0 ? (
              <View style={styles.emptyState}>
                <StyledText style={styles.iconEmptyText}>🎟️</StyledText>
                <StyledText style={styles.emptyText}>
                  No tienes descuentos disponibles
                </StyledText>
              </View>
            ) : (
              <FlatList
                data={descuentos}
                renderItem={renderDescuentoItem}
                keyExtractor={(item) => item.IdOpcion?.toString() || Math.random().toString()}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
              />
            )}

            <TouchableOpacity
              style={styles.noDescuentoButton}
              onPress={() => {
                onSelectDescuento(null);
                setModalVisible(false);
              }}
            >
              <StyledText style={styles.noDescuentoText}>
                No usar descuento
              </StyledText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  selectorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconText: {
    fontSize: 20,
  },
  selectorText: {
    fontSize: 14,
    color: '#333',
  },
  arrowIcon: {
    fontSize: 24,
    color: '#999',
  },
  descuentoAplicado: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    padding: 12,
    backgroundColor: '#e8f5e9',
    borderRadius: 8,
  },
  descuentoAplicadoTexto: {
    color: '#2e7d32',
    fontSize: 14,
    fontWeight: '600',
  },
  closeIcon: {
    fontSize: 18,
    color: '#d32f2f',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  closeButton: {
    fontSize: 24,
    color: '#999',
  },
  descuentoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  descuentoSeleccionado: {
    backgroundColor: '#e3f2fd',
  },
  descuentoInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  descuentoTexto: {
    flex: 1,
  },
  descuentoNombre: {
    fontSize: 16,
    marginBottom: 4,
  },
  descuentoDescripcion: {
    fontSize: 14,
    color: '#666',
  },
  descuentoMonto: {
    fontSize: 14,
    color: '#2e7d32',
    fontWeight: '600',
    marginTop: 4,
  },
  checkIcon: {
    fontSize: 24,
    color: theme.colors.blue,
    fontWeight: 'bold',
  },
  separator: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 16,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  iconEmptyText: {
    fontSize: 48,
  },
  emptyText: {
    marginTop: 16,
    color: '#666',
    textAlign: 'center',
  },
  noDescuentoButton: {
    padding: 16,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    marginTop: 8,
  },
  noDescuentoText: {
    color: theme.colors.blue,
    fontWeight: '600',
  },

  descuentoDeshabilitado: {
  opacity: 0.5,
  backgroundColor: '#f5f5f5',
  },
  
  descuentoNoDisponible: {
    fontSize: 12,
    color: '#d32f2f',
    fontWeight: '600',
    marginTop: 4,
  },

});