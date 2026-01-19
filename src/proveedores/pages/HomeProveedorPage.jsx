import React, { useState, useEffect, useContext } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { useNavigate } from "react-router-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import StyledText from "../../styles/StyledText";
import { StatusBar } from "expo-status-bar";
import Icon from "react-native-ico-material-design";
import theme from "../../theme";
import { AuthContext } from "../../auth/context/AuthContext";
import { apiUrl } from "../../../apiUrl";
import StatCard from "../components/StatCard";
import ActionCard from "../components/ActionCard";

// Acciones rápidas predeterminadas
const DEFAULT_ACTIONS = [
  {
    id: 'subir_producto',
    path: '/proveedor/crearProducto',
    icon: 'add-button',
    color: 'green',
    title: 'Subir Producto',
    desc: 'Agrega un nuevo producto a tu catálogo'
  },
  {
    id: 'nueva_oferta',
    path: '/proveedor/crearOferta',
    icon: 'price-tag',
    color: 'blue',
    title: 'Nueva Oferta',
    desc: 'Crea una oferta para tus productos'
  },
  {
    id: 'mis_ofertas',
    path: '/proveedor/home/ofertas',
    icon: 'list-view',
    color: 'gray',
    title: 'Ver Mis Ofertas',
    desc: 'Gestiona todas tus ofertas activas'
  },
  {
    id: 'explorar_demandas',
    path: '/proveedor/home/demandas',
    icon: 'search-button',
    color: 'gray',
    title: 'Explorar Demandas',
    desc: 'Encuentra nuevas oportunidades'
  }
];

const HomeProveedorPage = () => {
  const { authState } = useContext(AuthContext);
  const { user } = authState;
  const navigate = useNavigate();
  
  const [ofertasProv, setOfertasProv] = useState([]);
  const [quickActions, setQuickActions] = useState(DEFAULT_ACTIONS);
  const [loading, setLoading] = useState(true);

  // Función para obtener el saludo según la hora
  const getSaludo = () => {
    const hora = new Date().getHours();
    if (hora >= 5 && hora < 12) return "Buenos días";
    if (hora >= 12 && hora < 19) return "Buenas tardes";
    return "Buenas noches";
  };

  // Obtener ofertas del proveedor
  const getOfertasProv = async () => {
    try {
      if (!user?.IdUsuario) return;
      const resp = await fetch(`${apiUrl}/ofertas?idProveedor=${user.IdUsuario}`);
      const data = await resp.json();
      const { rows: ofertas } = !!data && data;
      setOfertasProv(ofertas || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Cargar acciones rápidas ordenadas por uso
  useEffect(() => {
    const loadQuickActions = async () => {
      try {
        const storageKey = `stats_proveedor_${user?.IdUsuario || 'guest'}`;
        const storedStatsStr = await AsyncStorage.getItem(storageKey);
        const storedStats = storedStatsStr ? JSON.parse(storedStatsStr) : {};

        const sortedActions = [...DEFAULT_ACTIONS].sort((a, b) => {
          const countA = storedStats[a.id] || 0;
          const countB = storedStats[b.id] || 0;
          return countB - countA;
        });

        setQuickActions(sortedActions.slice(0, 4));
      } catch (error) {
        console.error('Error loading quick actions:', error);
        setQuickActions(DEFAULT_ACTIONS.slice(0, 4));
      }
    };

    loadQuickActions();
  }, [user]);

  // Cargar ofertas al montar
  useEffect(() => {
    getOfertasProv();
  }, [user]);

  // Manejar click en acción rápida
  const handleActionClick = async (actionId, path) => {
    try {
      const storageKey = `stats_proveedor_${user?.IdUsuario || 'guest'}`;
      const storedStatsStr = await AsyncStorage.getItem(storageKey);
      const storedStats = storedStatsStr ? JSON.parse(storedStatsStr) : {};
      
      storedStats[actionId] = (storedStats[actionId] || 0) + 1;
      await AsyncStorage.setItem(storageKey, JSON.stringify(storedStats));

      const sortedActions = [...DEFAULT_ACTIONS].sort((a, b) => {
        const countA = storedStats[a.id] || 0;
        const countB = storedStats[b.id] || 0;
        return countB - countA;
      });
      setQuickActions(sortedActions.slice(0, 4));
    } catch (error) {
      console.error('Error saving action click:', error);
    }

    navigate(path);
  };

  const saludo = getSaludo();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header con saludo personalizado */}
      <View style={styles.header}>
        <StyledText style={styles.greeting}>
          {saludo}, <StyledText style={styles.userName}>{user?.Nombre || "Usuario"}</StyledText> 👋
        </StyledText>
        <StyledText style={styles.subtitle}>
          Aquí tienes un resumen de tu actividad en SUPLAIER
        </StyledText>
      </View>

      {/* Tarjetas de estadísticas */}
      <View style={styles.statsGrid}>
        <StatCard
          iconName="box-with-folders"
          iconColor="blue"
          value={loading ? "..." : ofertasProv.length.toString()}
          label="Ofertas activas"
          trend="Total histórico"
          trendColor="green"
          onPress={() => navigate('/proveedor/home/ofertas')}
        />
        <StatCard
          iconName="up-arrow"
          iconColor="green"
          value="$0"
          label="Ventas del mes"
          trend="Ponte pilas pues mi llave"
          trendColor="green"
        />
      </View>

      <View style={styles.statsGrid}>
        <StatCard
          iconName="clock"
          iconColor="orange"
          value="0"
          label="Órdenes pendientes"
          trend="Por confirmar"
          trendColor="blue"
          onPress={() => navigate('/proveedor/ordenes/principal')}
        />
        <StatCard
          iconName="shopping-cart"
          iconColor="purple"
          value="0"
          label="Demandas nuevas"
          trend="En tu categoría"
          trendColor="green"
          onPress={() => navigate('/proveedor/home/demandas')}
        />
      </View>

      {/* Sección de Acciones Rápidas */}
      <View style={styles.sectionHeader}>
        <StyledText style={styles.sectionTitle}>
          Acciones rápidas
        </StyledText>
      </View>

      <View style={styles.actionsGrid}>
        {quickActions.map((action) => (
          <ActionCard
            key={action.id}
            iconName={action.icon}
            iconColor={action.color}
            title={action.title}
            description={action.desc}
            onPress={() => handleActionClick(action.id, action.path)}
          />
        ))}
      </View>

      <View style={styles.spaceBorder} />
      <StatusBar style="light" />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f9fafb",
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  header: {
    marginBottom: 24,
  },
  greeting: {
    color: "#111827",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
    lineHeight: 28.8,
  },
  userName: {
    color: "#2563eb",
  },
  subtitle: {
    color: "#6b7280",
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 22.4,
    marginTop: 0,
  },
  statsGrid: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    marginTop: 28,
    marginBottom: 12,
  },
  sectionTitle: {
    color: "#111827",
    fontSize: 18,
    fontWeight: "700",
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    marginBottom: 16,
  },
  spaceBorder: {
    height: 100,
  },
});

export default HomeProveedorPage;
