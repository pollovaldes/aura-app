// ChangeImageModal.tsx
import React from "react";
import { View, Text, Alert, ActivityIndicator, Image } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import FormTitle from "@/app/auth/FormTitle";
import { FormButton } from "@/components/Form/FormButton";
import { Vehicle } from "@/types/Vehicle";

interface ChangeVehicleImageModalProps {
  closeModal: () => void;
  vehicle: Vehicle;
  selectThumbnail: (vehicleId: string) => Promise<void>;
  deleteThumbnail: (vehicleId: string) => Promise<void>;
}

export default function ChangeCoverImage({
  vehicle,
  closeModal,
  deleteThumbnail,
  selectThumbnail,
}: ChangeVehicleImageModalProps) {
  const { styles } = useStyles(stylesheet);

  const handleSelectImage = async () => {
    await selectThumbnail(vehicle.id);
    closeModal();
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
            await deleteThumbnail(vehicle.id);
            closeModal();
          },
        },
      ]
    );
  };

  const loading = false;

  return (
    <View style={styles.section}>
      <View style={styles.group}>
        <FormTitle title="Personalizar portada" />
        <Text style={styles.subtitle}>
          Cambia o elimina la foto de portada de este vehículo.
        </Text>
      </View>
      {vehicle.thumbnail && (
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: vehicle.thumbnail }}
            style={styles.coverImage}
          />
        </View>
      )}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator />
          <Text style={styles.text}>Subiendo imagen...</Text>
        </View>
      ) : (
        <View style={styles.group}>
          <View style={styles.group}>
            <FormButton
              title="Elegir nueva imagen"
              onPress={handleSelectImage}
            />
          </View>
          <View style={styles.group}>
            <FormButton
              title="Eliminar foto de perfil"
              onPress={handleDeleteProfileImage}
            />
          </View>
        </View>
      )}
    </View>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  section: {
    gap: theme.marginsComponents.section,
    alignItems: "center",
  },
  group: {
    gap: theme.marginsComponents.group,
    width: "100%",
  },
  subtitle: {
    color: theme.textPresets.main,
    textAlign: "center",
  },
  loadingContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  text: {
    color: theme.textPresets.main,
    fontSize: 16,
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 10,
    width: "100%",
  },
  coverImage: {
    width: "100%",
    aspectRatio: 16 / 9,
    borderRadius: 10,
  },
}));
