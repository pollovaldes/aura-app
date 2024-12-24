import React, { useState } from "react";
import { View, Text, ActivityIndicator, Image } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import FormTitle from "@/app/auth/FormTitle";
import { FormButton } from "@/components/Form/FormButton";
import { ConfirmDialog } from "@/components/alert/ConfirmDialog";
import { useVehicleThumbnail } from "@/hooks/useVehicleThumbnail";
import { Vehicle } from "@/types/globalTypes";
import * as ImagePicker from "expo-image-picker";
import useWebPConverter from "@/features/global/hooks/useWebPConverter";
import { SaveFormat, ImageManipulator } from "expo-image-manipulator";
import { supabase } from "@/lib/supabase";
import { decode } from "base64-arraybuffer";
import { getMimeTypeFromUri } from "@/features/global/functions/getMimeTypeFromUri";
import { getFileExtension } from "@/features/global/functions/getFileExtensionFromMimeType";

interface ChangeVehicleImageModalProps {
  closeModal: () => void;
  vehicle: Vehicle;
}

export function ChangeCoverImage({ vehicle, closeModal }: ChangeVehicleImageModalProps) {
  const { styles } = useStyles(stylesheet);
  const { thumbnail, refetchVehicleThumbnail } = useVehicleThumbnail(vehicle.id);
  const [imagePickingIsLoading, setImagePickingIsLoading] = useState(false);
  const [imageIsProcessing, setImageIsProcessing] = useState(false);
  const [pickedImage, setPickedImage] = useState<{ uri: string; base64: string; mimeType: string } | null>(null);
  const [imageIsUploading, setImageIsUploading] = useState(false);

  const handleSelectImage = async () => {
    setImagePickingIsLoading(true);
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [16, 9],
      selectionLimit: 1,
    });

    if (pickerResult.canceled) {
      setImagePickingIsLoading(false);
      setPickedImage(null);
      return;
    }

    setImagePickingIsLoading(false);

    setImageIsProcessing(true);
    const context = await ImageManipulator.manipulate(pickerResult.assets[0].uri);
    context.resize({ width: 800 });
    const manipulatedImage = await context.renderAsync();
    const thumbnail = await manipulatedImage.saveAsync({ compress: 0.5, format: SaveFormat.WEBP, base64: true });
    const mimeType = await getMimeTypeFromUri(thumbnail.uri);

    if (!thumbnail || thumbnail.base64 === undefined || !mimeType) {
      setPickedImage(null);
      setImageIsProcessing(false);
      return;
    }

    setPickedImage({
      uri: thumbnail.uri,
      base64: thumbnail.base64,
      mimeType: mimeType,
    });

    setImageIsProcessing(false);
  };

  const handleDeleteProfileImage = async () => {
    confirmDeleteVehicleThumbnail.showDialog();
  };

  const handleUploadImage = async () => {
    if (!pickedImage) {
      alert("No se ha seleccionado ninguna imagen.");
      return;
    }

    setImageIsUploading(true);
    const { error } = await supabase.storage
      .from("vehicles-thumbnails")
      .upload(
        `${vehicle.id}/${vehicle.id}_thumbnail.${getFileExtension(pickedImage.mimeType)}`,
        decode(pickedImage.base64),
        {
          cacheControl: "3600",
          upsert: true,
          contentType: pickedImage.mimeType,
        }
      );
    setImageIsUploading(false);

    if (error) {
      alert("No se ha podido subir la imagen.");
      console.error("Error uploading image", error);
      throw error;
    }

    alert("Se ha subido la imagen correctamente.");
    refetchVehicleThumbnail();
    closeModal();
  };

  const confirmDeleteVehicleThumbnail = ConfirmDialog({
    title: "Confirmación",
    message: "¿Estás seguro de que deseas eliminar la foto de portada de este vehículo?",
    confirmText: "Eliminar",
    cancelText: "Cancelar",
    onConfirm: () => {},
    onCancel: () => {},
  });

  return (
    <View style={styles.section}>
      <View style={styles.group}>
        <FormTitle title="Editar portada" />
      </View>

      <View style={styles.imageContainer}>
        {thumbnail?.isLoading ? (
          <View style={{ gap: 12 }}>
            <ActivityIndicator />
            <Text style={styles.subtitle}>Cargando imagen</Text>
          </View>
        ) : thumbnail?.imageURI ? (
          <Image source={{ uri: thumbnail?.imageURI }} style={styles.coverImage} />
        ) : (
          <Text style={styles.text}>Sin portada</Text>
        )}
      </View>

      {(imageIsProcessing || pickedImage) && (
        <View style={styles.group}>
          {pickedImage && <Text style={styles.subtitle}>Nueva portada</Text>}
          <View style={styles.imageContainer}>
            {imageIsProcessing ? (
              <View style={{ gap: 12 }}>
                <ActivityIndicator />
                <Text style={styles.subtitle}>Procesando imagen</Text>
              </View>
            ) : (
              pickedImage && <Image source={{ uri: pickedImage.uri }} style={styles.coverImage} />
            )}
          </View>
          <FormButton
            title="Guardar nueva imagen de portada"
            onPress={handleUploadImage}
            isDisabled={imageIsProcessing}
            isLoading={imageIsUploading}
          />
        </View>
      )}

      <View style={styles.group}>
        <View style={styles.group}>
          <FormButton
            title={pickedImage ? "Elegir otra imagen" : "Elegir imagen"}
            onPress={handleSelectImage}
            isDisabled={thumbnail?.isLoading || imageIsProcessing || imageIsUploading}
            isLoading={imagePickingIsLoading}
          />
        </View>
        <View style={styles.group}>
          <FormButton
            title="Eliminar portada"
            buttonType="danger"
            onPress={handleDeleteProfileImage}
            isDisabled={thumbnail?.isLoading || imagePickingIsLoading || imageIsProcessing || imageIsUploading}
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
    fontSize: 16,
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
    width: "100%",
    aspectRatio: 16 / 9,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.ui.colors.border,
  },
  coverImage: {
    borderRadius: 10,
    height: "100%",
    width: "100%",
  },
}));
