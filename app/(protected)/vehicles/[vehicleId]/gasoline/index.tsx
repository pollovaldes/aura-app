import React, { useState } from "react";
import { router, Stack } from "expo-router";

import {
  View,
  ScrollView,
  RefreshControl,
  Text,
  Alert,
} from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import GroupedList from "@/components/grouped-list/GroupedList";
import Row from "@/components/grouped-list/Row";
import {
  BookUser,
  NotebookPen,
} from "lucide-react-native";
import { colorPalette } from "@/style/themes";
import UnauthorizedScreen from "@/components/dataStates/UnauthorizedScreen";
import EmptyScreen from "@/components/dataStates/EmptyScreen";
import ErrorScreen from "@/components/dataStates/ErrorScreen";
import LoadingScreen from "@/components/dataStates/LoadingScreen";
import Modal from "@/components/Modal/Modal";
import UploadGasolinePhotoModal from "@/components/profile/UploadGaolinePhotoModal";

type ModalType =
  | "upload_gasoline_photo"
  | null;

export default function Index() {
  const { styles } = useStyles(stylesheet);
  const loading = false;
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const closeModal = () => setActiveModal(null);

  if (loading) {
    return (
      <>
        <Stack.Screen options={{ title: "Cargando..." }} />
        <LoadingScreen caption="Cargando datos de la persona" />
      </>
    );
  }


  if ("algo" === null) {
    return (
      <>
        <Stack.Screen
          options={{ title: "Recurso inaccesible", headerLargeTitle: false }}
        />
        <ErrorScreen
          caption={`Ocurrió un error y no \npudimos cargar los datos de la persona`}
          buttonCaption="Reintentar"
          retryFunction={() => { Alert.alert("Reintentar") }}
        />
      </>
    );
  }

  // Título dinámico basado en la persona
  const personTitle = "Cargas de Gasolina";

  return (
    <>
      <Stack.Screen options={{ title: personTitle }} />


      <Modal isOpen={activeModal === "upload_gasoline_photo"}>
        <View style={styles.modalContainer}>
          <Text style={styles.closeButton} onPress={closeModal}>
            Cerrar
          </Text>
          <UploadGasolinePhotoModal closeModal={closeModal}/>
        </View>
      </Modal>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => { Alert.alert("Recargar") }}
          />
        }
      >
        <View style={styles.container}>
          <GroupedList
            header="Registrar"
            footer="Registrar una nueva carga de gasolina"
          >
            <Row
              title="Registrar carga de gasolina"
              trailingType="chevron"
              onPress={() => setActiveModal("upload_gasoline_photo")}
              icon={<BookUser size={24} color="white" />}
              color={colorPalette.neutral[500]}
            />
          </GroupedList>

          <GroupedList
            header="Cargas pendientes"
            footer="Ver las cargas de gasolina pendientes"
          >
            <Row
              title="Asignar camión"
              trailingType="chevron"
              onPress={() => { Alert.alert("Asignar camión") }}
              icon={<NotebookPen size={24} color="white" />}
              color={colorPalette.orange[500]}
            />
          </GroupedList>
        </View>
      </ScrollView>
    </>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  container: {
    marginTop: theme.marginsComponents.section,
    gap: theme.marginsComponents.section,
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

}));
