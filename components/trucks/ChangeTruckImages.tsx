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
  ActivityIndicator,
} from "react-native";
import { FormButton } from "@/components/Form/FormButton"; // Asegúrate de que la ruta es correcta
import { Truck } from "@/types/Truck";
import useTruck from "@/hooks/truckHooks/useTruck";
import useTruckThumbnail from "@/hooks/truckHooks/useTruckThumbnail";

interface ChangeTruckImageModalProps {
  visible: boolean;
  closeModal: () => void;
  truck: Truck;
  selectThumbnail: (truckId: string) => Promise<void>;
  addPhotoToGallery: (truckId: string) => Promise<void>;
  deleteThumbnail: (truckId: string) => Promise<void>;
  deletePhotoFromGalley: (truckId: string, fileName: string) => Promise<void>;
}

export default function ChangeTruckImageModal({
  visible,
  closeModal,
  truck,
  selectThumbnail,
  addPhotoToGallery,
  deleteThumbnail,
  deletePhotoFromGalley,
}: ChangeTruckImageModalProps) {
  const handleSelectImage = async () => {
    await selectThumbnail(truck.id);
    closeModal();
  };

  const handleAddGalleryImage = async () => {
    await addPhotoToGallery(truck.id);
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
            await deleteThumbnail(truck.id);
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
            await deletePhotoFromGalley(truck.id, fileName);
          },
        },
      ]
    );
  };

  const { trucks, setTrucks } = useTruck();
  const { thumbnailIsLoading } = useTruckThumbnail(truck.id, trucks, setTrucks);

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={closeModal}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>
          Foto de Perfil - {truck.brand} {truck.sub_brand}
        </Text>

        <View style={styles.section}>
          {thumbnailIsLoading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : truck.thumbnail ? (
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: truck.thumbnail }}
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

        {/* <View style={styles.section}>
          <Text style={styles.subtitle}>Galería</Text>
          {truck.galery.length > 0 ? (
            truck.galery.map((image, index) => (
              <View key={index} style={styles.galeriaItem}>
                <Image
                  source={{ uri: image.uri as string }}
                  style={styles.galeriaImage}
                />
                <TouchableOpacity
                  onPress={() =>
                    handleDeleteGalleryImage(image.fileName as string)
                  }
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
        </View> */}

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
