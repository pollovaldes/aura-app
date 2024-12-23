import { ActionButton } from "@/components/actionButton/ActionButton";
import { ActionButtonGroup } from "@/components/actionButton/ActionButtonGroup";
import EmptyScreen from "@/components/dataStates/EmptyScreen";
import ErrorScreen from "@/components/dataStates/ErrorScreen";
import { FetchingIndicator } from "@/components/dataStates/FetchingIndicator";
import UnauthorizedScreen from "@/components/dataStates/UnauthorizedScreen";
import Modal from "@/components/Modal/Modal";
import { SimpleList } from "@/components/simpleList/SimpleList";
import AddDocument from "@/components/vehicles/modals/AddDocument";
import { useVehicle } from "@/hooks/truckHooks/useVehicle";
import useDocuments from "@/hooks/useDocuments";
import useProfile from "@/hooks/useProfile";
import { Stack, useFocusEffect, useLocalSearchParams } from "expo-router";
import { Plus, RotateCw } from "lucide-react-native";
import React, { useCallback, useState } from "react";
import { FlatList, Platform, Text, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

type ModalType = "add_document" | null;

export default function VehicleDocumentation() {
  const { styles } = useStyles(stylesheet);
  const { getGuaranteedProfile } = useProfile();
  const profile = getGuaranteedProfile();
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

  if (vehiclesAreLoading || areDocumentsLoading) {
    return <FetchingIndicator caption={vehiclesAreLoading ? "Cargando vehículos" : "Cargando documentos"} />;
  }

  if (vehicles === null) {
    return (
      <ErrorScreen
        caption={`Ocurrió un error y no \npudimos cargar los vehículos`}
        buttonCaption="Reintentar"
        retryFunction={fetchVehicles}
      />
    );
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

  const vehicle = vehicles.find((Vehicle) => Vehicle.id === vehicleId);

  if (!vehicle) {
    return (
      <UnauthorizedScreen
        caption="No tienes acceso a este recurso."
        buttonCaption="Reintentar"
        retryFunction={fetchVehicles}
      />
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
              <ActionButton
                Icon={Plus}
                onPress={() => setActiveModal("add_document")}
                show={canEdit}
                text="Agregar documento"
              />
              <ActionButton
                onPress={() => {
                  fetchDocuments();
                  fetchVehicles();
                }}
                Icon={RotateCw}
                text="Actualizar"
                show={Platform.OS === "web"}
              />
            </ActionButtonGroup>
          ),
        }}
      />

      <FlatList
        refreshing={vehiclesAreLoading || areDocumentsLoading}
        onRefresh={() => {
          fetchVehicles();
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
