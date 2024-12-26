// ChangeImageModal.tsx
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Platform } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import FormTitle from "@/app/auth/FormTitle";
import { FormButton } from "@/components/Form/FormButton";
import { supabase } from "@/lib/supabase";
import FormInput from "@/components/Form/FormInput";
import { ArrowUpFromLine, File, FilePlus, Plus, X } from "lucide-react-native";
import { DocumentPickerAsset } from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { decode } from "base64-arraybuffer";
import * as DocumentPicker from "expo-document-picker";
import { Vehicle } from "@/types/globalTypes";
import Toast from "react-native-toast-message";

interface AddDocumentModalProps {
  closeModal: () => void;
  refreshDocuments: () => void;
  vehicle: Vehicle;
}

export function AddDocumentModal({ closeModal, refreshDocuments, vehicle }: AddDocumentModalProps) {
  const { styles } = useStyles(stylesheet);
  const [documentTitle, setDocumentTitle] = useState("");
  const [documentDescription, setDocumentDescription] = useState("");
  const [documentIsUploading, setDocumentIsUploading] = useState(false);
  const [documentDatabaseIsUploading, setDocumentDatabaseIsUploading] = useState(false);
  const [pickedDocument, setPickedDocument] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [documentPickingIsLoading, setDocumentPickingIsLoading] = useState(false);

  const showToast = (title: string, caption: string) => {
    Toast.show({
      type: "alert",
      text1: title,
      text2: caption,
    });
  };

  const handlePickDocument = async () => {
    setDocumentPickingIsLoading(true);
    const pickerResult = await DocumentPicker.getDocumentAsync({
      multiple: false,
    });

    if (pickerResult.canceled) {
      setDocumentPickingIsLoading(false);
      setPickedDocument(null);
      return;
    }

    setPickedDocument(pickerResult.assets[0]);
    setDocumentPickingIsLoading(false);
  };

  const uploadDocument = async (documentId: string) => {
    setDocumentIsUploading(true);

    if (!pickedDocument) {
      showToast("Error", "No se seleccionó un archivo para subir");
      setDocumentIsUploading(false);
      return false;
    }

    let fileData;
    if (Platform.OS === "web") {
      fileData = pickedDocument.file;
    } else {
      fileData = await FileSystem.readAsStringAsync(pickedDocument.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      fileData = decode(fileData);
    }

    if (!fileData) {
      showToast("Error", "Ocurrió un error al leer el archivo seleccionado");
      setDocumentIsUploading(false);
      return false;
    }

    const { error } = await supabase.storage.from("documents").upload(`${vehicle.id}/${documentId}`, fileData, {
      contentType: pickedDocument.mimeType,
    });

    if (error) {
      showToast("Error", "Ocurrió un error al subir el archivo");
      console.error("Error uploading file", error);
      setDocumentIsUploading(false);
      return false;
    }

    showToast("Éxito", "El archivo se subió correctamente");
    setDocumentIsUploading(false);
    return true;
  };

  const handleAddDocumentToDatabase = async () => {
    setDocumentDatabaseIsUploading(true);

    const { data, error } = await supabase
      .from("vehicle_documentation_sheet")
      .insert([
        {
          vehicle_id: vehicle.id,
          title: documentTitle,
          description: documentDescription,
        },
      ])
      .select()
      .single();

    if (error) {
      showToast("Error", "Ocurrió un error al agregar el documento a la base de datos");
      console.error("Error adding document to database", error);
      setDocumentDatabaseIsUploading(false);
      return;
    }

    const uploadSuccess = await uploadDocument(data.document_id);

    if (!uploadSuccess) {
      const { error } = await supabase.from("vehicle_documentation_sheet").delete().eq("document_id", data.document_id);
      setDocumentDatabaseIsUploading(false);
      return;
    }

    setDocumentDatabaseIsUploading(false);
    refreshDocuments();
    closeModal();
  };

  return (
    <View style={styles.section}>
      <View style={styles.group}>
        <FormTitle title="Agregar un nuevo documento" />
        <Text style={styles.subtitle}>Llena los campos para agregar un nuevo documento a este vehículo.</Text>
      </View>
      <View style={styles.group}>
        <FormInput
          placeholder="Ej. Seguro de auto"
          inputMode="text"
          style={styles.textInput}
          placeholderTextColor={styles.textInput.placehoolderTextColor}
          onChangeText={setDocumentTitle}
          description="Nombre amigable del documento (obligatorio)"
          editable={!documentDatabaseIsUploading && !documentIsUploading && !documentPickingIsLoading}
        />
        <FormInput
          placeholder="Ej. Póliza"
          inputMode="text"
          style={styles.textInput}
          placeholderTextColor={styles.textInput.placehoolderTextColor}
          onChangeText={setDocumentDescription}
          description="Descripción del documento"
          editable={!documentDatabaseIsUploading && !documentIsUploading && !documentPickingIsLoading}
        />
        <FormButton
          title="Seleccionar archivo"
          onPress={handlePickDocument}
          isLoading={documentPickingIsLoading}
          Icon={File}
          isDisabled={documentIsUploading || documentDatabaseIsUploading || documentPickingIsLoading}
        />

        {pickedDocument && (
          <View style={styles.filePreviewContainer}>
            <View>
              <TouchableOpacity onPress={() => setPickedDocument(null)}>
                <X color={styles.fileIcon.color} />
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: "row", gap: 6 }}>
              <File color={styles.fileIcon.color} size={50} />
              <View
                style={{
                  flexDirection: "column",
                  justifyContent: "space-around",
                  width: "75%",
                }}
              >
                <Text style={styles.fileText} ellipsizeMode="middle" numberOfLines={2}>
                  {pickedDocument.name}
                </Text>
                <Text style={styles.fileSubtitle}>{((pickedDocument.size ?? 0) / 1000000).toFixed(2)} MB</Text>
              </View>
            </View>
          </View>
        )}
      </View>
      <View style={styles.group}>
        <FormButton
          Icon={ArrowUpFromLine}
          title="Agregar documento"
          onPress={handleAddDocumentToDatabase}
          isLoading={documentIsUploading || documentDatabaseIsUploading}
          isDisabled={!pickedDocument || documentTitle === ""}
        />
        <Text style={styles.subtitle}>
          {documentIsUploading
            ? "Subiendo documento al servidor..."
            : documentDatabaseIsUploading && "Agregando documento a la base de datos..."}
        </Text>
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
  fileSubtitle: {
    color: theme.textPresets.main,
  },
  fileText: {
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
  textInput: {
    height: 45,
    borderRadius: 5,
    paddingHorizontal: 12,
    fontSize: 18,
    color: theme.textPresets.main,
    placehoolderTextColor: theme.textPresets.subtitle,
    backgroundColor: theme.textInput.backgroundColor,
  },
  buttonIcon: {
    color: theme.textPresets.inverted,
  },
  fileIcon: {
    color: theme.textPresets.subtitle,
  },
  filePreviewContainer: {
    borderColor: theme.ui.colors.border,
    borderWidth: 1,
    borderRadius: 6,
    padding: 12,
    flexDirection: "row-reverse",
    justifyContent: "space-between",
  },
}));
