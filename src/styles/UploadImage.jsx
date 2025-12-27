import React, { useState } from "react";
import { Image, View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import theme from "../theme";
import StyledText from "./StyledText";
import * as ImagePicker from "expo-image-picker";

export default function UploadImage({ setImageUri }) {
  const [image, setImage] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [base64Image, setBase64Image] = useState(null);

  const addImage = async () => {
    // Solicitar permisos
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      alert('Se necesitan permisos para acceder a la galería de fotos');
      return;
    }

    const _image = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
      base64: true,
    });

    if (!_image.canceled) {
      try {
        const response = await fetch(_image.assets[0].uri);
        const blob = await response.blob();

        // eslint-disable-next-line no-undef
        const reader = new FileReader();
        reader.onload = () => {
          const base64Data = reader.result;
          setBase64Image(base64Data);
          setImage(base64Data);
          setImageUri(base64Data);
        };
        reader.readAsDataURL(blob);
      } catch (error) {
        console.error("Error al convertir la imagen a base64:", error);
      }
    }
  };

  const removeImage = () => {
    setImage(null);
    setBase64Image(null);
    setImageUri(null);
  };

  return (
    <>
      <TouchableOpacity
        onPress={addImage}
        style={imageUploaderStyles.uploadButton}
      >
        <Ionicons 
          name={image ? "image" : "cloud-upload-outline"} 
          size={24} 
          color={theme.colors.primary} 
        />
        <StyledText fontSize="body" style={imageUploaderStyles.uploadText}>
          {image ? "Cambiar imagen" : "Seleccionar archivo"}
        </StyledText>
        {!image && (
          <StyledText fontSize="small" color="textGray" style={imageUploaderStyles.hint}>
            Ningún archivo seleccionado
          </StyledText>
        )}
      </TouchableOpacity>

      {image && (
        <View style={imageUploaderStyles.imageContainer}>
          <Image
            source={{ uri: image }}
            style={imageUploaderStyles.image}
          />
          <TouchableOpacity
            onPress={removeImage}
            style={imageUploaderStyles.removeButton}
          >
            <Ionicons name="close-circle" size={32} color={theme.colors.error} />
          </TouchableOpacity>
        </View>
      )}
    </>
  );
}

const imageUploaderStyles = StyleSheet.create({
  uploadButton: {
    backgroundColor: theme.colors.inputBackground,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.s,
    borderStyle: "dashed",
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  uploadText: {
    color: theme.colors.primary,
    fontWeight: "600",
  },
  hint: {
    marginTop: 4,
  },
  imageContainer: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.s,
    padding: 12,
    backgroundColor: theme.colors.backgroundLight,
    position: "relative",
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "contain",
  },
  removeButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: theme.colors.background,
    borderRadius: 16,
  },
});
