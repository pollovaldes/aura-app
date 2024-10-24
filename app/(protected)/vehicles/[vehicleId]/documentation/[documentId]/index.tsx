import ErrorScreen from "@/components/dataStates/ErrorScreen";
import LoadingScreen from "@/components/dataStates/LoadingScreen";
import UnauthorizedScreen from "@/components/dataStates/UnauthorizedScreen";
import FileViewer from "@/components/fileViewer/FileViewer";
import Modal from "@/components/Modal/Modal";
import EditDocument from "@/components/vehicles/modals/EditDocument";
import useDocuments from "@/hooks/useDocuments";
import useProfile from "@/hooks/useProfile";
import { Stack, useFocusEffect, useLocalSearchParams } from "expo-router";
import { RotateCw, Share } from "lucide-react-native";
import React from "react";
import { useCallback, useState } from "react";
import { View, Text, Platform, Pressable } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

type ModalType = "edit_document" | null;

export default function Index() {
  const { styles } = useStyles(stylesheet);
  const { documentId } = useLocalSearchParams<{ documentId: string }>();
  const { profile, isProfileLoading, fetchProfile } = useProfile();
  const { documents, areDocumentsLoading, fetchDocuments } = useDocuments();
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [randomKey, setRandomKey] = useState(0); // This is a hack to force the FileViewer to re-render
  const closeModal = () => setActiveModal(null);

  if (isProfileLoading) {
    return (
      <>
        <Stack.Screen
          options={{
            title: "Cargando...",
            headerLargeTitle: false,
            headerRight: undefined,
          }}
        />
        <LoadingScreen caption="Cargando perfil y permisos" />
      </>
    );
  }

  if (areDocumentsLoading) {
    return (
      <>
        <Stack.Screen
          options={{
            title: "Cargando...",
            headerLargeTitle: false,
            headerRight: undefined,
          }}
        />
        <LoadingScreen caption="Cargando documentos" />
      </>
    );
  }

  if (!profile) {
    return (
      <>
        <Stack.Screen
          options={{
            title: "Error",
            headerLargeTitle: false,
            headerRight: undefined,
          }}
        />
        <ErrorScreen
          caption="Ocurrió un error al recuperar tu perfil"
          buttonCaption="Reintentar"
          retryFunction={fetchProfile}
        />
      </>
    );
  }

  if (documents === null) {
    return (
      <>
        <Stack.Screen
          options={{
            title: "Recurso inaccesible",
            headerLargeTitle: false,
            headerRight: undefined,
          }}
        />
        <ErrorScreen
          caption={`Ocurrió un error y no \npudimos cargar los documentos`}
          buttonCaption="Reintentar"
          retryFunction={fetchDocuments}
        />
      </>
    );
  }

  const document = documents.find(
    (Document) => Document.document_id === documentId
  );

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
          retryFunction={fetchDocuments}
        />
      </>
    );
  }

  const canEdit = profile.role === "ADMIN" || profile.role === "OWNER";

  const fileUrl = `https://wkkfbhlvghhrscihbdev.supabase.co/storage/v1/object/public/documents/${document.vehicle_id}/${document.document_id}`;

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
              <Pressable onPress={() => setActiveModal("edit_document")}>
                <Share color={styles.Icon.color} />
              </Pressable>
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
          <EditDocument
            closeModal={closeModal}
            document={document}
            fetchDocuments={fetchDocuments}
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
    color: theme.ui.colors.primary,
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
    color: theme.ui.colors.primary,
    fontSize: 18,
    textAlign: "right",
  },
  Icon: {
    fontSize: 16,
    color: theme.ui.colors.primary,
  },
}));
