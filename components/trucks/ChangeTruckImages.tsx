// components/trucks/ChangeTruckImages.tsx
import React from "react";
import {
  View,
  Text,
  Alert,
  Modal,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { FormButton } from "@/components/Form/FormButton"; // Asegúrate de que la ruta es correcta
import { Truck, GaleryImage } from "@/types/Truck";

interface ChangeTruckImageModalProps {
  visible: boolean;
  closeModal: () => void;
  truck: Truck;
  seleccionarFotoPerfil: (truckId: string) => Promise<void>;
  agregarFotoGaleria: (truckId: string) => Promise<void>;
  eliminarFotoPerfil: (truckId: string) => Promise<void>;
  eliminarFotoGaleria: (truckId: string, fileName: string) => Promise<void>;
}

export default function ChangeTruckImageModal({
  visible,
  closeModal,
  truck,
  seleccionarFotoPerfil,
  agregarFotoGaleria,
  eliminarFotoPerfil,
  eliminarFotoGaleria,
}: ChangeTruckImageModalProps) {
  const handleSelectImage = async () => {
    await seleccionarFotoPerfil(truck.id);
    closeModal();
  };

  const handleAddGalleryImage = async () => {
    await agregarFotoGaleria(truck.id);
  };

  const handleDeleteProfileImage = () => {
    Alert.alert(
      "Confirmación",
      "¿Estás seguro de que deseas eliminar la foto de perfil?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            await eliminarFotoPerfil(truck.id);
            closeModal();
          },
        },
      ]
    );
  };

  const handleDeleteGalleryImage = (fileName: string) => {
    Alert.alert(
      "Confirmación",
      "¿Estás seguro de que deseas eliminar esta foto de la galería?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            await eliminarFotoGaleria(truck.id, fileName);
          },
        },
      ]
    );
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={closeModal}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>
          Foto de Perfil - {truck.brand} {truck.sub_brand}
        </Text>

        <View style={styles.section}>
          {truck.thumbnail ? (
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: truck.thumbnail as string }}
                style={styles.profileImage}
              />
              <TouchableOpacity
                onPress={handleDeleteProfileImage}
                style={styles.deleteButton}
              >
                <Text style={{ color: "red" }}>Eliminar Foto de Perfil</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Text>No hay foto de perfil.</Text>
          )}
          <FormButton
            title="Elegir nueva foto de perfil"
            onPress={handleSelectImage}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.subtitle}>Galería</Text>
          {truck.galery.length > 0 ? (
            truck.galery.map((image, index) => (
              <View key={index} style={styles.galeriaItem}>
                <Image
                  source={{ uri: image.uri }}
                  style={styles.galeriaImage}
                />
                <TouchableOpacity
                  onPress={() => handleDeleteGalleryImage(image.fileName)}
                  style={styles.deleteButton}
                >
                  <Text style={{ color: "red" }}>Eliminar</Text>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <Text>No hay imágenes en la galería.</Text>
          )}
          <FormButton
            title="Agregar foto a la galería"
            onPress={handleAddGalleryImage}
          />
        </View>

        <FormButton title="Cerrar" onPress={closeModal} />
      </ScrollView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  section: {
    width: "100%",
    gap: 10,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  deleteButton: {
    marginTop: 5,
  },
  galeriaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  galeriaImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 10,
  },
});
