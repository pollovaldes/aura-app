import React, { useState } from "react";
import { View, Text, ActivityIndicator, Image, Platform } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import FormTitle from "@/app/auth/FormTitle";
import { FormButton } from "@/components/Form/FormButton";
import { ConfirmDialog } from "@/components/alert/ConfirmDialog";
import { useVehicleThumbnail } from "@/hooks/useVehicleThumbnail";
import { Vehicle } from "@/types/globalTypes";
import * as ImagePicker from "expo-image-picker";
import { SaveFormat, ImageManipulator } from "expo-image-manipulator";
import { supabase } from "@/lib/supabase";
import { decode } from "base64-arraybuffer";
import { getMimeTypeFromUri } from "@/features/global/functions/getMimeTypeFromUri";
import { getFileExtension } from "@/features/global/functions/getFileExtensionFromMimeType";
import Toast from "react-native-toast-message";
import { ImagePlus, Trash2 } from "lucide-react-native";

interface ChangeVehicleImageModalProps {
  close: () => void;
  vehicle: Vehicle;
}

export function ChangeCoverImageModal({ vehicle, close }: ChangeVehicleImageModalProps) {
  const { styles, theme } = useStyles(stylesheet);
  const { thumbnail, refetchVehicleThumbnail } = useVehicleThumbnail(vehicle.id);
  const [imagePickingIsLoading, setImagePickingIsLoading] = useState(false);
  const [imageIsProcessing, setImageIsProcessing] = useState(false);
  const [pickedImage, setPickedImage] = useState<{ uri: string; base64: string; mimeType: string } | null>(null);
  const [imageIsUploading, setImageIsUploading] = useState(false);
  const [imageIsDeleting, setImageIsDeleting] = useState(false);

  const showToast = (title: string, caption: string) => {
    Toast.show({
      type: "alert",
      text1: title,
      text2: caption,
    });
  };

  const deleteAllFilesFromBucket = async () => {
    setImageIsDeleting(true);

    const { data, error: listError } = await supabase.storage
      .from("vehicles-thumbnails")
      .list(`${vehicle.id}/`, { limit: 100 });

    setImageIsDeleting(false);

    if (listError || !data) {
      showToast("Error", "Ocurrió un error al listar las imágenes.");
      console.error("Error listing files", listError);
      return false;
    }

    if (data.length > 0) {
      const filePaths = data.map((file) => `${vehicle.id}/${file.name}`);
      const { error: deleteError } = await supabase.storage.from("vehicles-thumbnails").remove(filePaths);

      if (deleteError) {
        showToast("Error", "Ocurrió un error al eliminar las imágenes.");
        console.error("Error deleting files", deleteError);
        return false;
      }

      showToast("Éxito", "Todas las imágenes se eliminaron correctamente.");
    } else {
      showToast("Aviso", "No se encontraron imágenes para eliminar.");
    }

    return Promise.resolve(true);
  };

  const handleSelectImage = async () => {
    setImagePickingIsLoading(true);
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: false,
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

  const handleDeleteThumbnail = async () => {
    confirmDeleteVehicleThumbnail.showDialog();
  };

  const handleUploadThumbnail = async () => {
    setImageIsUploading(true);

    if (!pickedImage) {
      showToast("Error", "No se ha seleccionado ninguna imagen.");
      setImageIsUploading(false);
      return;
    }

    const deletionSuccess = await deleteAllFilesFromBucket();

    if (!deletionSuccess) {
      return;
    }

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
      showToast("Error", "Ocurrió un error al subir la imagen.");
      console.error("Error uploading image", error);
      return;
    }

    showToast("Éxito", "Imagen subida correctamente.");
    refetchVehicleThumbnail();
    close();
  };

  const confirmDeleteVehicleThumbnail = ConfirmDialog({
    title: "Confirmación",
    message: "¿Estás seguro de que deseas eliminar la foto de portada de este vehículo?",
    confirmText: "Eliminar",
    cancelText: "Cancelar",
    onConfirm: async () => {
      await deleteAllFilesFromBucket();
      refetchVehicleThumbnail();
      close();
    },
    onCancel: () => {},
  });

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <FormTitle title="Editar portada" />
      </View>

      <View style={styles.imageContainer}>
        {thumbnail?.isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color={Platform.OS !== "ios" ? theme.ui.colors.primary : undefined} />
            <Text style={styles.loadingText}>Cargando portada</Text>
          </View>
        ) : thumbnail?.imageURI ? (
          <Image source={{ uri: thumbnail.imageURI }} style={styles.coverImage} />
        ) : (
          <Text style={styles.noImageText}>Sin portada</Text>
        )}
      </View>

      {(imageIsProcessing || pickedImage) && (
        <View style={styles.newImageContainer}>
          {pickedImage && <Text style={styles.newImageText}>Nueva portada</Text>}
          <View style={styles.imageContainer}>
            {imageIsProcessing ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color={Platform.OS !== "ios" ? theme.ui.colors.primary : undefined} />
                <Text style={styles.loadingText}>Procesando imagen</Text>
              </View>
            ) : (
              pickedImage && <Image source={{ uri: pickedImage.uri }} style={styles.coverImage} />
            )}
          </View>
          <FormButton
            title="Guardar nueva imagen de portada"
            onPress={handleUploadThumbnail}
            isDisabled={imageIsProcessing}
            isLoading={imageIsUploading}
          />
        </View>
      )}

      <View style={styles.actionsContainer}>
        <FormButton
          Icon={ImagePlus}
          title={pickedImage ? "Elegir otra imagen" : "Elegir imagen"}
          onPress={handleSelectImage}
          isDisabled={thumbnail?.isLoading || imageIsProcessing || imageIsUploading || imageIsDeleting}
          isLoading={imagePickingIsLoading}
        />
        {thumbnail?.imageURI && !thumbnail?.isLoading && (
          <FormButton
            title="Eliminar portada"
            Icon={Trash2}
            buttonType="danger"
            onPress={handleDeleteThumbnail}
            isLoading={imageIsDeleting}
            isDisabled={
              thumbnail?.isLoading || imagePickingIsLoading || imageIsProcessing || imageIsUploading || imageIsDeleting
            }
          />
        )}
      </View>
    </View>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  container: {
    gap: theme.marginsComponents.section,
    alignItems: "center",
  },
  titleContainer: {
    gap: theme.marginsComponents.group,
    width: "100%",
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
  loadingContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  loadingText: {
    color: theme.textPresets.main,
    fontSize: 16,
    textAlign: "center",
  },
  noImageText: {
    color: theme.textPresets.main,
    fontSize: 16,
    textAlign: "center",
  },
  newImageContainer: {
    gap: theme.marginsComponents.group,
    width: "100%",
  },
  newImageText: {
    color: theme.textPresets.main,
    fontSize: 16,
    textAlign: "center",
  },
  actionsContainer: {
    gap: theme.marginsComponents.group,
    width: "100%",
  },
}));
