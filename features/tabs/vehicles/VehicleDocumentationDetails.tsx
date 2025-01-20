import ErrorScreen from "@/components/dataStates/ErrorScreen";
import UnauthorizedScreen from "@/components/dataStates/UnauthorizedScreen";
import FileViewer from "@/components/fileViewer/FileViewer";
import Modal from "@/components/Modal/Modal";
import EditDocument from "@/components/vehicles/modals/EditDocument";
import useDocuments from "@/hooks/useDocuments";
import useProfile from "@/hooks/useProfile";
import { Stack, useLocalSearchParams } from "expo-router";
import { Download, Pencil, RotateCw, Share as ShareIcon } from "lucide-react-native";
import React from "react";
import { useState } from "react";
import { ActivityIndicator, Platform } from "react-native";
import { useStyles } from "react-native-unistyles";
import * as FileSystem from "expo-file-system";
import { supabase } from "@/lib/supabase";
import { Share } from "react-native";
import { ActionButtonGroup } from "@/components/actionButton/ActionButtonGroup";
import { ActionButton } from "@/components/actionButton/ActionButton";
import { FetchingIndicator } from "@/components/dataStates/FetchingIndicator";

type ModalType = "edit_document" | null;

export default function VehicleDocumentationDetails() {
  const { documentId } = useLocalSearchParams<{ documentId: string }>();
  const { getGuaranteedProfile } = useProfile();
  const profile = getGuaranteedProfile();
  const { documents, areDocumentsLoading, fetchDocuments } = useDocuments();
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [randomKey, setRandomKey] = useState(0); // This is a hack to force the FileViewer to re-render
  const [isSharing, setIsSharing] = useState(false);
  const closeModal = () => setActiveModal(null);
  const { theme } = useStyles();

  if (areDocumentsLoading) {
    return <FetchingIndicator caption="Cargando documentos" />;
  }

  if (documents === null) {
    return (
      <ErrorScreen
        caption={`Ocurrió un error y no \npudimos cargar los documentos`}
        buttonCaption="Reintentar"
        retryFunction={fetchDocuments}
      />
    );
  }

  const document = documents.find((Document) => Document.document_id === documentId);

  if (!document) {
    return (
      <UnauthorizedScreen
        caption="No tienes acceso a este recurso."
        buttonCaption="Reintentar"
        retryFunction={fetchDocuments}
      />
    );
  }

  const canEdit = profile.role === "ADMIN" || profile.role === "OWNER";
  const fileUrl = `https://wkkfbhlvghhrscihbdev.supabase.co/storage/v1/object/public/documents/${document.vehicle_id}/${document.document_id}`;

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
    };
    return mimeToExtensionMap[mimeType] || "bin";
  };

  const shareDocument = async () => {
    try {
      setIsSharing(true);

      const { data: blob, error } = await supabase.storage
        .from("documents")
        .download(`${document.vehicle_id}/${document.document_id}`);

      if (error) {
        console.error("Error downloading the document:", error.message);
        setIsSharing(false);
        return;
      }

      const mimeType = blob.type;

      const fileData = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (reader.result) {
            resolve(reader.result.toString().split(",")[1]);
          } else {
            reject(new Error("Failed to read file as Base64."));
          }
        };
        reader.onerror = () => reject(new Error("File reading error"));
        reader.readAsDataURL(blob);
      });

      if (typeof fileData !== "string") {
        throw new Error("File data is not a valid string.");
      }

      const fileUri = `${FileSystem.documentDirectory}${document.document_id}.${getFileExtensionFromMimeType(mimeType)}`;

      await FileSystem.writeAsStringAsync(fileUri, fileData, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const androidUri = Platform.OS === "android" ? `file://${fileUri}` : fileUri;

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
            <ActionButtonGroup>
              <ActionButton
                show={!isSharing && !(Platform.OS === "web")}
                onPress={shareDocument}
                Icon={ShareIcon}
                text="Compartir"
              />
              <ActionButton
                show={!isSharing && Platform.OS === "web"}
                onPress={shareDocument}
                Icon={Download}
                text="Descargar"
              />
              {isSharing && <ActivityIndicator color={Platform.OS !== "ios" ? theme.ui.colors.primary : undefined} />}
              <ActionButton
                show={canEdit}
                onPress={() => setActiveModal("edit_document")}
                text="Editar"
                Icon={Pencil}
              />
              <ActionButton onPress={() => setRandomKey(Math.random())} Icon={RotateCw} text="Actualizar" />
            </ActionButtonGroup>
          ),
        }}
      />

      <Modal isOpen={activeModal === "edit_document"} close={closeModal}>
        <EditDocument closeModal={closeModal} document={document} fetchDocuments={fetchDocuments} />
      </Modal>
      <FileViewer fileUrl={fileUrl} randomKey={randomKey} />
    </>
  );
}
