//Borrar alv



import React from "react";
import { View, Text, Alert, ActivityIndicator } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import FormTitle from "@/app/auth/FormTitle";
import { FormButton } from "@/components/Form/FormButton";
//import { useGasolinePhoto } from "@/context/GasolinePhotoContext"; // Custom hook for gasoline photo management

export default function UploadGasolinePhotoModal({
  closeModal,
}: {
  closeModal: () => void;
}) {
  //const { onSelectPhoto, deleteGasolinePhoto, loading } = useGasolinePhoto();
  const { styles } = useStyles(stylesheet);

  const handleSelectPhoto = async () => {
    //await onSelectPhoto();
    closeModal();
  };

  const handleDeletePhoto = () => {
    Alert.alert(
      "Confirmation",
      "Are you sure you want to delete your gasoline load photo?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            //await deleteGasolinePhoto();
            closeModal();
          },
        },
      ]
    );
  };

  return (
    <View style={styles.section}>
      <View style={styles.group}>
        <FormTitle title="Gasoline Load Photo" />
        <Text style={styles.subtitle}>Customize your gasoline load photo</Text>
      </View>
      {false ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator />
          <Text>Uploading image...</Text>
        </View>
      ) : (
        <View style={styles.group}>
          <View style={styles.group}>
            <FormButton
              title="Choose New Photo"
              onPress={handleSelectPhoto}
            />
          </View>
          <View style={styles.group}>
            <FormButton
              title="Delete Gasoline Photo"
              onPress={handleDeletePhoto}
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
}));
