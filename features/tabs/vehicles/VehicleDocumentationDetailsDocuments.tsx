import ErrorScreen from "@/components/dataStates/ErrorScreen";
import LoadingScreen from "@/components/dataStates/LoadingScreen";
import UnauthorizedScreen from "@/components/dataStates/UnauthorizedScreen";
import FileViewer from "@/components/fileViewer/FileViewer";
import Modal from "@/components/Modal/Modal";
import EditDocument from "@/components/vehicles/modals/EditDocument";
import useProfile from "@/hooks/useProfile";
import { Stack, useLocalSearchParams } from "expo-router";
import { RotateCw, Share as ShareIcon } from "lucide-react-native";
import React from "react";
import { useState } from "react";
import { View, Text, Pressable, ActivityIndicator, Platform } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import * as FileSystem from "expo-file-system";
import { supabase } from "@/lib/supabase";
import { Share } from "react-native";
import useMaintenanceDocuments from "@/hooks/useMaintenanceDocuments";
import EditMaintenanceDocument from "@/components/vehicles/modals/EditMaintenanceDocument";
import { FetchingIndicator } from "@/components/dataStates/FetchingIndicator";

type ModalType = "edit_document" | null;

export default function VehicleDocumentationDetailsDocuments() {
  const { styles } = useStyles(stylesheet);
  const { getGuaranteedProfile } = useProfile();
  const profile = getGuaranteedProfile();
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [randomKey, setRandomKey] = useState(0); // This is a hack to force the FileViewer to re-render
  const [isSharing, setIsSharing] = useState(false);
  const { documentId } = useLocalSearchParams<{
    documentId: string;
  }>();
  const { areMaintenanceDocumentsLoading, fetchMaintenanceDocuments, maintenanceDocuments } = useMaintenanceDocuments();
  const closeModal = () => setActiveModal(null);

  if (areMaintenanceDocumentsLoading) {
    return <FetchingIndicator caption="Cargando documentos de mantenimiento" />;
  }

  if (maintenanceDocuments === null) {
    return (
      <ErrorScreen
        caption={`Ocurrió un error y no \npudimos cargar los documentos`}
        buttonCaption="Reintentar"
        retryFunction={fetchMaintenanceDocuments}
      />
    );
  }

  const document = maintenanceDocuments.find((Document) => Document.document_id === documentId);

  if (!document) {
    return (
      <>
        <Stack.Screen
          options={{
            title: "Recurso inaccesible",
            headerRight: undefined,
            headerLargeTitle: false,
          }}
        />
        <UnauthorizedScreen
          caption="No tienes acceso a este recurso."
          buttonCaption="Reintentar"
          retryFunction={fetchMaintenanceDocuments}
        />
      </>
    );
  }

  const canEdit = profile.role === "ADMIN" || profile.role === "OWNER";
  const fileUrl = `https://wkkfbhlvghhrscihbdev.supabase.co/storage/v1/object/public/maintenance_files/${document.vehicle_id}/${document.maintenance_id}/${document.document_id}`;

  const getFileExtensionFromMimeType = (mimeType: string) => {
    const mimeToExtensionMap: Record<string, string> = {
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/gif": "gif",
      "video/mp4": "mp4",
      "video/quicktime": "mov",
      "application/msword": "doc",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
      "application/vnd.ms-excel": "xls",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
      "application/vnd.ms-powerpoint": "ppt",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation": "pptx",
      "application/pdf": "pdf",
      "text/plain": "txt",
      // Add more mappings as needed
    };
    return mimeToExtensionMap[mimeType] || "bin"; // Default to 'bin' if unknown MIME type
  };

  const shareDocument = async () => {
    try {
      // Set isSharing to true to indicate loading
      setIsSharing(true);

      // Fetch the document from Supabase
      const { data: blob, error } = await supabase.storage
        .from("maintenance_files")
        .download(`${document.vehicle_id}/${document.maintenance_id}/${document.document_id}`);

      if (error) {
        console.error("Error downloading the document:", error.message);
        setIsSharing(false);
        return;
      }

      // Get the MIME type from the blob
      const mimeType = blob.type;

      // Use FileReader to convert the Blob to a Base64 string
      const fileData = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (reader.result) {
            // Get Base64 content after "data:*/*;base64,"
            resolve(reader.result.toString().split(",")[1]);
          } else {
            reject(new Error("Failed to read file as Base64."));
          }
        };
        reader.onerror = () => reject(new Error("File reading error"));
        reader.readAsDataURL(blob); // Read as a Data URL to get Base64 content
      });

      // Make sure fileData is a string before writing
      if (typeof fileData !== "string") {
        throw new Error("File data is not a valid string.");
      }

      // Create a local file path to save the Blob
      const fileUri = `${FileSystem.documentDirectory}${document.document_id}.${getFileExtensionFromMimeType(mimeType)}`;

      // Write the Base64 string to the file system
      await FileSystem.writeAsStringAsync(fileUri, fileData, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // On Android, prepend the URI with "file://"
      const androidUri = Platform.OS === "android" ? `file://${fileUri}` : fileUri;

      // Share the file using React Native's Share API
      const result = await Share.share({
        title: document.title,
        url: androidUri,
        message: `Check out this document: ${document.title}`,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log("Shared with activity type: ", result.activityType);
        } else {
          console.log("Document shared successfully.");
        }
      } else if (result.action === Share.dismissedAction) {
        console.log("Document sharing was dismissed.");
      }
    } catch (err) {
      console.error("An error occurred while sharing the document:", err);
    } finally {
      // Set isSharing to false to indicate completion
      setIsSharing(false);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: document.title,
          headerLargeTitle: false,
          headerRight: () => (
            <View style={styles.rightContainer}>
              {canEdit && (
                <Pressable onPress={() => setActiveModal("edit_document")}>
                  <Text style={styles.rightPressText}>Editar</Text>
                </Pressable>
              )}
              {isSharing ? (
                <ActivityIndicator />
              ) : (
                <Pressable onPress={() => shareDocument()}>
                  <ShareIcon color={styles.Icon.color} />
                </Pressable>
              )}
              <Pressable onPress={() => setRandomKey(Math.random())}>
                <RotateCw color={styles.Icon.color} />
              </Pressable>
            </View>
          ),
        }}
      />

      <Modal isOpen={activeModal === "edit_document"}>
        <View style={styles.modalContainer}>
          <Text style={styles.closeButton} onPress={closeModal}>
            Cerrar
          </Text>
          <EditMaintenanceDocument
            closeModal={closeModal}
            document={document}
            fetchDocuments={fetchMaintenanceDocuments}
          />
        </View>
      </Modal>
      <FileViewer fileUrl={fileUrl} randomKey={randomKey} />
    </>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  container: {
    flex: 10000, // This is a hack to make the LoadingScreen fill the screen
    justifyContent: "center",
    alignItems: "center",
  },
  rightContainer: {
    flexDirection: "row-reverse",
    gap: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: theme.textPresets.main,
  },
  rightPressText: {
    color: theme.headerButtons.color,
    fontSize: 17,
  },
  modalContainer: {
    width: "100%",
    alignSelf: "center",
    maxWidth: 500,
    backgroundColor: theme.ui.colors.card,
    borderRadius: 10,
    padding: 24,
  },
  closeButton: {
    color: theme.headerButtons.color,
    fontSize: 18,
    textAlign: "right",
  },
  Icon: {
    fontSize: 16,
    color: theme.headerButtons.color,
  },
}));
