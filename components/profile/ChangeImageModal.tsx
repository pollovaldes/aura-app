// ChangeImageModal.tsx
import React from "react";
import { View, Text, Alert } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import FormTitle from "@/app/auth/FormTitle";
import { FormButton } from "@/components/Form/FormButton";
import { useProfileImage } from "@/context/ProfileImageContext";

export default function ChangeImageModal({
  closeModal,
}: {
  closeModal: () => void;
}) {
  const { onSelectImage, deleteProfileImage, loading } = useProfileImage();
  const { styles } = useStyles(stylesheet);

  const handleSelectImage = async () => {
    await onSelectImage();
    closeModal();
  };

  const handleDeleteImage = () => {
    Alert.alert(
      "Confirmación",
      "¿Estás seguro de que deseas eliminar tu foto de perfil?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            await deleteProfileImage();
            closeModal();
          },
        },
      ]
    );
  };

  return (
    <View style={styles.section}>
      <View style={styles.group}>
        <FormTitle title="Foto de perfil" />
        <Text style={styles.subtitle}>Personaliza tu foto</Text>
      </View>
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
            onPress={handleDeleteImage}
          />
        </View>
      </View>
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
  // Removed unused styles like logo and textInput
}));