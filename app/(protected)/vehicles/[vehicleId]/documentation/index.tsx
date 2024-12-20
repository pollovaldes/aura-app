import { View, ScrollView, RefreshControl, Pressable, Text, FlatList } from "react-native";
import { router, Stack, useFocusEffect, useLocalSearchParams } from "expo-router";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import GroupedList from "@/components/grouped-list/GroupedList";
import Row from "@/components/grouped-list/Row";
import LoadingScreen from "@/components/dataStates/LoadingScreen";
import ErrorScreen from "@/components/dataStates/ErrorScreen";
import UnauthorizedScreen from "@/components/dataStates/UnauthorizedScreen";
import useProfile from "@/hooks/useProfile";
import useVehicle from "@/hooks/truckHooks/useVehicle";
import useDocuments from "@/hooks/useDocuments";
import { ChevronRight, Plus } from "lucide-react-native";
import Modal from "@/components/Modal/Modal";
import { useCallback, useState } from "react";
import AddDocument from "@/components/vehicles/modals/AddDocument";
import EmptyScreen from "@/components/dataStates/EmptyScreen";
import React from "react";
import { FetchingIndicator } from "@/components/dataStates/FetchingIndicator";
import { ActionButtonGroup } from "@/components/actionButton/ActionButtonGroup";
import { ActionButton } from "@/components/actionButton/ActionButton";
import { SimpleList } from "@/components/simpleList/SimpleList";

type ModalType = "add_document" | null;

export default function Index() {
  const { styles } = useStyles(stylesheet);
  const { profile, isProfileLoading, fetchProfile } = useProfile();
  const { vehicles, vehiclesAreLoading, fetchVehicles } = useVehicle();
  const { documents, areDocumentsLoading, fetchDocuments } = useDocuments();
  const { vehicleId } = useLocalSearchParams<{ vehicleId: string }>();
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const closeModal = () => setActiveModal(null);

  useFocusEffect(
    useCallback(() => {
      fetchDocuments();
    }, [])
  );

  if (isProfileLoading || vehiclesAreLoading || areDocumentsLoading) {
    return (
      <>
        <Stack.Screen
          options={{
            title: "Cargando...",
            headerLargeTitle: false,
            headerRight: undefined,
          }}
        />
        <FetchingIndicator
          caption={
            isProfileLoading ? "Cargando perfil" : vehiclesAreLoading ? "Cargando vehículos" : "Cargando documentos"
          }
        />
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

  if (vehicles === null) {
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
          caption={`Ocurrió un error y no \npudimos cargar los vehículos`}
          buttonCaption="Reintentar"
          retryFunction={fetchVehicles}
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

  const vehicle = vehicles.find((Vehicle) => Vehicle.id === vehicleId);

  if (!vehicle) {
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
          retryFunction={fetchVehicles}
        />
      </>
    );
  }

  const associatedDocuments = documents.filter((doc) => doc.vehicle_id === vehicleId);

  const canEdit = profile.role === "ADMIN" || profile.role === "OWNER";

  return (
    <>
      <Modal isOpen={activeModal === "add_document"}>
        <View style={styles.modalContainer}>
          <Text style={styles.closeButton} onPress={closeModal}>
            Cerrar
          </Text>
          <AddDocument closeModal={closeModal} vehicle={vehicle} refreshDocuments={fetchDocuments} />
        </View>
      </Modal>

      <Stack.Screen
        options={{
          title: "Guantera Digital",
          headerLargeTitle: false,
          headerRight: () => (
            <ActionButtonGroup>
              <ActionButton Icon={Plus} onPress={() => setActiveModal("add_document")} show={canEdit} />
            </ActionButtonGroup>
          ),
        }}
      />

      <FlatList
        refreshing={vehiclesAreLoading || isProfileLoading || areDocumentsLoading}
        onRefresh={() => {
          fetchVehicles();
          fetchProfile();
          fetchDocuments();
        }}
        contentInsetAdjustmentBehavior="automatic"
        data={associatedDocuments}
        keyExtractor={(item) => item.document_id}
        renderItem={({ item }) => (
          <SimpleList
            relativeToDirectory
            href={`./${item.document_id}`}
            content={
              <View style={{ flexDirection: "column" }}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemSubtitle}>
                  {item.description ? item.description : "No se proveyó ninguna descripción."}
                </Text>
              </View>
            }
          />
        )}
        ListEmptyComponent={<EmptyScreen caption="No hay documentos para este vehículo." />}
      />
    </>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  container: {
    gap: theme.marginsComponents.section,
    marginTop: theme.marginsComponents.section,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  details: {
    fontSize: 18,
    color: theme.textPresets.main,
  },
  plusIcon: {
    color: theme.headerButtons.color,
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
  itemTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.textPresets.main,
  },
  itemSubtitle: {
    fontSize: 15,
    color: theme.textPresets.subtitle,
  },
}));
