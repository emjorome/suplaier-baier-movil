import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons"; 
import { theme } from "../theme";

const SearchInput = ({ onSearch, placeholder = "Buscar..." }) => {
  const [searchText, setSearchText] = useState("");

  const handleSearch = () => {
    if (onSearch) onSearch(searchText);
  };

  return (
    <View style={styles.container}>
      {/* Icono de Lupa a la izquierda (Estilo visual moderno) */}
      <Icon 
        name="search" 
        size={20} 
        color={theme.colors.textGray} 
        style={styles.searchIcon}
      />

      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textGray} 
        value={searchText}
        onChangeText={setSearchText}
        onSubmitEditing={handleSearch}
        returnKeyType="search"
        selectionColor={theme.colors.primary} 
      />

      {/* Botón opcional de limpieza o acción si hay texto */}
      {searchText.length > 0 && (
        <TouchableOpacity onPress={handleSearch} style={styles.actionButton}>
           <Icon name="arrow-forward" size={20} color={theme.colors.primary} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.inputBackground, 
    borderRadius: theme.borderRadius.m, 
    paddingHorizontal: theme.spacing.m,
    height: 50,
    // ...theme.shadows.soft 
  },
  searchIcon: {
    marginRight: theme.spacing.s,
  },
  input: {
    flex: 1,
    fontSize: theme.fontSizes.body,
    color: theme.colors.textPrimary,
    height: "100%",
  },
  actionButton: {
    padding: 5,
  }
});

export default SearchInput;