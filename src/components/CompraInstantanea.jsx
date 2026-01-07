import React, { useEffect, useState, useContext } from "react";
import { View, StyleSheet, TouchableOpacity, ScrollView, TextInput, Image, Alert } from 'react-native';
import { StyledText } from '../../components/StyledText';
import { AuthContext } from '../../auth/context/AuthContext';
import { useDescuentos } from '../hooks/DescuentosDataProvider';
import { useRecompensas } from '../hooks/RecompensasDataProvider';
import { SelectorDescuento } from './SelectorDescuento';
import { apiUrl } from '../../../apiUrl';

export const CompraInstantanea = ({
  onClose,
  oferta,
  producto,
  onSuccess,
}) => {
  const { authState } = useContext(AuthContext);
  const { user } = authState;
  const { descuentos, refreshDescuentos } = useDescuentos();
  const { balance: saldoEstrellas, refreshBalance } = useRecompensas();

  const [cantidad, setCantidad] = useState('1');
  const [proveedor, setProveedor] = useState(null);
  const [descuentoSeleccionado, setDescuentoSeleccionado] = useState(null);
  const [loading, setLoading] = useState(false);

  // Calcular subtotal
  const calcularSubtotal = () => {
    const cant = parseInt(cantidad) || 0;
    return cant * (oferta?.ValorUInstantaneo || 0);
  };

  // Calcular descuento
  const calcularDescuento = () => {
    if (!descuentoSeleccionado) return 0;
    
    const subtotal = calcularSubtotal();
    const porcentaje = descuentoSeleccionado.PorcentajeDescuento || descuentoSeleccionado.Porcentaje || 0;
    
    return subtotal * (porcentaje / 100);
  };

  // Calcular total
  const calcularTotal = () => {
    return Math.max(0, calcularSubtotal() - calcularDescuento());
  };

  // Obtener proveedor
  useEffect(() => {
    const getProveedor = async () => {
      try {
        const resp = await fetch(`${apiUrl}/usuarios?idUsuario=${oferta.IdProveedor}`);
        const data = await resp.json();
        if (data?.rows?.[0]) {
          setProveedor(data.rows[0]);
        }
      } catch (error) {
        console.error("Error obteniendo proveedor:", error);
      }
    };

    if (oferta?.IdProveedor) {
      getProveedor();
    }
  }, [oferta]);

  // Validar descuento seleccionado
  const handleSelectDescuento = (desc) => {
    if (!desc) {
      setDescuentoSeleccionado(null);
      return;
    }

    const costoEstrellas = desc.CostoEstrellas || 0;
    
    if (saldoEstrellas < costoEstrellas) {
      Alert.alert(
        'Estrellas insuficientes',
        `Necesitas ${costoEstrellas} estrellas para usar este descuento. Tu saldo: ${saldoEstrellas}⭐`
      );
      return;
    }

    setDescuentoSeleccionado(desc);
  };

  // Crear compra
  const handleComprar = async () => {
    const cant = parseInt(cantidad);
    
    if (!cant || cant < 1) {
      Alert.alert('Error', 'Ingresa una cantidad válida');
      return;
    }

    const unidadesDisponibles = (oferta?.Maximo || 0) - (oferta?.ActualProductos || 0);
    if (cant > unidadesDisponibles) {
      Alert.alert('Error', `Solo hay ${unidadesDisponibles} unidades disponibles`);
      return;
    }

    setLoading(true);

    try {
      // 1. Crear compra
      const body = {
        IdComprador: user.IdUsuario,
        IdProveedor: oferta.IdProveedor,
        IdOferta: oferta.IdOferta,
        Cantidad: cant,
        Total: calcularTotal(),
        Descripcion: "",
        Observacion: "",
        IdEstado: oferta.IdEstadosOferta,
        MetodoPago: "reserva",
        PagadoAProveedor: false,
        TipoCompra: "instantanea",
        IdOpcionDescuento: descuentoSeleccionado?.IdOpcion || null,
      };

      const resp = await fetch(`${apiUrl}/compras`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!resp.ok) throw new Error('Error al crear compra');

      // 2. Actualizar oferta
      await fetch(`${apiUrl}/ofertas`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          IdOferta: oferta.IdOferta,
          NuevoActualProductos: (oferta.ActualProductos || 0) + cant,
        }),
      });

      // 3. Refrescar datos
      refreshDescuentos();
      refreshBalance();

      Alert.alert('¡Éxito!', 'Compra realizada correctamente', [
        { text: 'OK', onPress: () => onSuccess?.() }
      ]);

      onClose();

    } catch (error) {
      console.error("Error en compra:", error);
      Alert.alert('Error', 'No se pudo completar la compra');
    } finally {
      setLoading(false);
    }
  };

  const unidadesDisponibles = (oferta?.Maximo || 0) - (oferta?.ActualProductos || 0);

  return (
    <View style={styles.overlay}>
      <View style={styles.modal}>
        <ScrollView style={styles.scrollView}>
          {/* Header */}
          <View style={styles.header}>
            <StyledText fontWeight="bold" fontSize="title">
              Unirse a la oferta
            </StyledText>
            <TouchableOpacity onPress={onClose}>
              <StyledText fontSize="title">✕</StyledText>
            </TouchableOpacity>
          </View>

          {/* Producto */}
          <View style={styles.productoBox}>
            <Image
              source={{ uri: producto?.UrlImg === "no-img.jpeg" ? "/no-img.jpeg" : producto?.UrlImg }}
              style={styles.productoImg}
            />
            <View style={styles.productoInfo}>
              <StyledText fontWeight="bold">{producto?.Name}</StyledText>
              <StyledText>Precio unitario: ${oferta?.ValorUInstantaneo?.toFixed(2)}</StyledText>
              <StyledText>Unidades disponibles: {unidadesDisponibles}</StyledText>
            </View>
          </View>

          {/* Proveedor */}
          {proveedor && (
            <View style={styles.infoBox}>
              <StyledText fontWeight="bold">Proveedor: {proveedor.Nombre}</StyledText>
            </View>
          )}

          {/* Fecha */}
          <View style={styles.infoBox}>
            <StyledText>Fecha de cierre: {oferta?.FechaLimite?.split("T")[0]}</StyledText>
          </View>

          {/* Saldo de estrellas */}
          <View style={styles.saldoBox}>
            <StyledText fontWeight="bold">
              ⭐ Tu saldo: {saldoEstrellas} Estrellas
            </StyledText>
          </View>

          {/* Selector de descuento */}
          <SelectorDescuento
            descuentos={descuentos}
            descuentoSeleccionado={descuentoSeleccionado}
            onSelectDescuento={handleSelectDescuento}
            montoOriginal={calcularSubtotal()}
          />

          {/* Input cantidad */}
          <View style={styles.cantidadBox}>
            <StyledText>Cantidad:</StyledText>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={cantidad}
              onChangeText={setCantidad}
              placeholder="1"
            />
          </View>

          {/* Resumen */}
          <View style={styles.resumen}>
            <View style={styles.fila}>
              <StyledText>Subtotal:</StyledText>
              <StyledText>${calcularSubtotal().toFixed(2)}</StyledText>
            </View>

            {descuentoSeleccionado && (
              <View style={styles.fila}>
                <StyledText style={styles.descuento}>Descuento:</StyledText>
                <StyledText style={styles.descuento}>
                  -${calcularDescuento().toFixed(2)}
                </StyledText>
              </View>
            )}

            <View style={styles.separador} />

            <View style={[styles.fila, styles.total]}>
              <StyledText fontWeight="bold" fontSize="subtitle">Total:</StyledText>
              <StyledText fontWeight="bold" fontSize="subtitle" style={styles.totalMonto}>
                ${calcularTotal().toFixed(2)}
              </StyledText>
            </View>
          </View>
        </ScrollView>

        {/* Botones */}
        <View style={styles.botonesBox}>
          <TouchableOpacity
            style={[styles.boton, styles.botonCancelar]}
            onPress={onClose}
          >
            <StyledText style={styles.botonTexto}>Cancelar</StyledText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.boton, styles.botonContinuar, loading && styles.botonDisabled]}
            onPress={handleComprar}
            disabled={loading}
          >
            <StyledText style={[styles.botonTexto, { color: '#fff' }]}>
              {loading ? 'Procesando...' : 'Continuar'}
            </StyledText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '90%',
    maxHeight: '90%',
    overflow: 'hidden',
  },
  scrollView: {
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  productoBox: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  productoImg: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  productoInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  infoBox: {
    padding: 16,
    paddingTop: 8,
  },
  saldoBox: {
    padding: 16,
    backgroundColor: '#f9f9f9',
    marginHorizontal: 16,
    borderRadius: 8,
  },
  cantidadBox: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  resumen: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    margin: 16,
    borderRadius: 8,
  },
  fila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  descuento: {
    color: '#2e7d32',
    fontWeight: '600',
  },
  separador: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 12,
  },
  total: {
    marginTop: 4,
  },
  totalMonto: {
    color: '#1976d2',
  },
  botonesBox: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  boton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  botonCancelar: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#dc3545',
  },
  botonContinuar: {
    backgroundColor: '#1976d2',
  },
  botonDisabled: {
    opacity: 0.5,
  },
  botonTexto: {
    fontWeight: '600',
    fontSize: 16,
    color: '#dc3545',
  },
});