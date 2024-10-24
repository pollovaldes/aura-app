// ChangeImageModal.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
} from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import FormTitle from "@/app/auth/FormTitle";
import { FormButton } from "@/components/Form/FormButton";
import { supabase } from "@/lib/supabase";
import { Vehicle } from "@/types/Vehicle";
import FormInput from "@/components/Form/FormInput";
import { ArrowUpFromLine, File, Plus, X } from "lucide-react-native";
import { DocumentPickerAsset } from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { decode } from "base64-arraybuffer";
import * as DocumentPicker from "expo-document-picker";

interface AddDocumentModalProps {
  closeModal: () => void;
  refreshDocuments: () => void;
  vehicle: Vehicle;
}

export default function AddDocument({
  closeModal,
  refreshDocuments,
  vehicle,
}: AddDocumentModalProps) {
  const { styles } = useStyles(stylesheet);
  const [documentTitle, setDocumentTitle] = useState("");
  const [documentDescription, setDocumentDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [document, setDocument] = useState<DocumentPickerAsset | null>(null);

  const getDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "*/*",
      copyToCacheDirectory: true,
    });

    if (result.canceled) {
      alert("La selección de archivo fue cancelada");
      setDocument(null);
    }

    if (result.assets) {
      setDocument(result.assets[0]);
    } else {
      setDocument(null);
    }
  };

  const uploadDocument = async (documentId: string): Promise<boolean> => {
    if (!document) {
      alert(
        "No se puede subir el archivo porque no se ha seleccionado ninguno"
      );
      return false;
    }

    let fileData;
    if (Platform.OS === "web") {
      fileData = document.file;
    } else {
      fileData = await FileSystem.readAsStringAsync(document.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      fileData = decode(fileData);
    }

    if (!fileData) {
      alert("No se pudo procesar el archivo para la carga");
      return false;
    }

    const { data, error } = await supabase.storage
      .from("documents")
      .upload(`${vehicle.id}/${documentId}`, fileData, {
        contentType: document.mimeType,
      });

    if (error) {
      alert(
        `Ocurrió un error al subir el archivo \n–––– Detalles del error ––––\n\nMensaje de error: ${error.message}`
      );
      return false;
    }

    return true;
  };

  const handleAddDocument = async () => {
    setIsUploading(true);
    const { data, error } = await supabase
      .from("vehicle_documentation_sheet")
      .insert([
        {
          vehicle_id: vehicle.id,
          title: documentTitle,
          description: documentDescription,
        },
      ])
      .select();

    if (error && !data) {
      alert(
        `Ocurrió un error al agregar el documento \n–––– Detalles del error ––––\n\nMensaje de error: ${error.message}\n\nCódigo de error: ${error.code}\n\nDetalles: ${error.details}\n\nSugerencia: ${error.hint}`
      );
      return;
    }

    const uploadSuccess = await uploadDocument(data[0].document_id);

    console.log(uploadSuccess);

    if (!uploadSuccess) {
      const { error } = await supabase
        .from("vehicle_documentation_sheet")
        .delete()
        .eq("document_id", data[0].document_id);
    } else {
    }

    setIsUploading(false);
    refreshDocuments();
    closeModal();
  };

  return (
    <View style={styles.section}>
      <View style={styles.group}>
        <FormTitle title="Agregar un nuevo documento" />
        <Text style={styles.subtitle}>
          Llena los campos para agregar un nuevo documento a este vehículo.
        </Text>
      </View>
      <View style={styles.group}>
        <FormInput
          placeholder="Ej. Seguro de auto"
          inputMode="text"
          style={styles.textInput}
          placeholderTextColor={styles.textInput.placehoolderTextColor}
          onChangeText={setDocumentTitle}
          description="Nombre amigable del documento (obligatorio)"
          editable={!isUploading}
        />
        <FormInput
          placeholder="Ej. Póliza"
          inputMode="text"
          style={styles.textInput}
          placeholderTextColor={styles.textInput.placehoolderTextColor}
          onChangeText={setDocumentDescription}
          description="Descripción del documento"
          editable={!isUploading}
        />
        <FormButton
          title="Seleccionar archivo"
          onPress={getDocument}
          icon={() => <ArrowUpFromLine color={styles.buttonIcon.color} />}
          isDisabled={isUploading && !!document}
        />

        {document && (
          <View style={styles.filePreviewContainer}>
            <View>
              <TouchableOpacity onPress={() => setDocument(null)}>
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
                <Text
                  style={styles.fileText}
                  ellipsizeMode="middle"
                  numberOfLines={2}
                >
                  {document.name}
                </Text>
                <Text style={styles.fileSubtitle}>
                  {((document.size ?? 0) / 1000000).toFixed(2)} MB
                </Text>
              </View>
            </View>
          </View>
        )}
      </View>
      <View style={styles.group}>
        <FormButton
          title="Agregar documento"
          onPress={handleAddDocument}
          isLoading={isUploading}
          isDisabled={!document || documentTitle === ""}
        />
        <Text style={styles.subtitle}>
          {isUploading && "Subiendo archivo, no cierres la app"}
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
