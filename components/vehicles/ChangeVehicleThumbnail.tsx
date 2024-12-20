// components/vehicles/ChangeVehicleImages.tsx
import React from "react";
import { View, Text, Alert, Modal, ScrollView, Image, TouchableOpacity, StyleSheet } from "react-native";
import { FormButton } from "@/components/Form/FormButton"; // Asegúrate de que la ruta es correcta
import { Vehicle } from "@/types/Vehicle";

interface ChangeVehicleImageModalProps {
  visible: boolean;
  closeModal: () => void;
  vehicle: Vehicle;
  selectThumbnail: (vehicleId: string) => Promise<void>;
  addPhotoToGallery: (vehicleId: string) => Promise<void>;
  deleteThumbnail: (vehicleId: string) => Promise<void>;
  deletePhotoFromGalley: (vehicleId: string, fileName: string) => Promise<void>;
}

export default function ChangeVehicleImageModal({
  visible,
  closeModal,
  vehicle,
  selectThumbnail,
  addPhotoToGallery,
  deleteThumbnail,
  deletePhotoFromGalley,
}: ChangeVehicleImageModalProps) {
  const handleSelectImage = async () => {
    await selectThumbnail(vehicle.id);
    closeModal();
  };

  const handleAddGalleryImage = async () => {
    await addPhotoToGallery(vehicle.id);
  };

  const handleDeleteProfileImage = () => {
    Alert.alert("Confirmación", "¿Estás seguro de que deseas eliminar la foto de perfil?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          await deleteThumbnail(vehicle.id);
          closeModal();
        },
      },
    ]);
  };

  const handleDeleteGalleryImage = (fileName: string) => {
    Alert.alert("Confirmación", "¿Estás seguro de que deseas eliminar esta foto de la galería?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          await deletePhotoFromGalley(vehicle.id, fileName);
        },
      },
    ]);
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={closeModal}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>
          Foto de Perfil - {vehicle.brand} {vehicle.sub_brand}
        </Text>

        <View style={styles.section}>
          {vehicle.thumbnail ? (
            <View style={styles.imageContainer}>
              <Image source={{ uri: vehicle.thumbnail }} style={styles.profileImage} />
              <TouchableOpacity onPress={handleDeleteProfileImage} style={styles.deleteButton}>
                <Text style={{ color: "red" }}>Eliminar Foto de Perfil</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Text>No hay foto de perfil.</Text>
          )}
          <FormButton title="Elegir nueva foto de perfil" onPress={handleSelectImage} />
        </View>
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
