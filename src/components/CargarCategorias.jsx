import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import PropTypes from "prop-types";
import ListCategoria from "./ListCategoria";   // PascalCase ✔
import { apiUrl } from "../../apiUrl";

const CargarCategorias = ({ onSelectCategoria }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${apiUrl}/catProductos`);
        const data = await response.json();
        setCategorias(data.rows);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
      setIsLoading(false);
    };

    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <ListCategoria
          categorias={categorias}
          onSelectCategoria={onSelectCategoria}
        />
      )}
    </View>
  );
};

/* 🔥 PropTypes para corregir S6774 */
CargarCategorias.propTypes = {
  onSelectCategoria: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  container: {},
});

/* Exportación por defecto correcta */
export default CargarCategorias;
