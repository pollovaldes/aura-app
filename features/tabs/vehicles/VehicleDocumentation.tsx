import React, { useEffect, useState } from "react";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { FlatList, Platform, Text, View, Alert } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { ActionButton } from "@/components/actionButton/ActionButton";
import { ActionButtonGroup } from "@/components/actionButton/ActionButtonGroup";
import { FetchingIndicator } from "@/components/dataStates/FetchingIndicator";
import { SimpleList } from "@/components/simpleList/SimpleList";
import { AddDocumentModal } from "@/features/tabs/vehicles/modals/AddDocumentModal";
import { useVehicles } from "@/hooks/truckHooks/useVehicle";
import { supabase } from "@/lib/supabase";
import { FilePlus, RotateCw } from "lucide-react-native";
import { colorPalette } from "@/style/themes";
import useProfile from "@/hooks/useProfile";
import useDocuments from "@/hooks/useDocuments";
import ErrorScreen from "@/components/dataStates/ErrorScreen";
import UnauthorizedScreen from "@/components/dataStates/UnauthorizedScreen";
import Modal from "@/components/Modal/Modal";
import EmptyScreen from "@/components/dataStates/EmptyScreen";

type ModalType = "add_document" | null;

export function VehicleDocumentation() {
  const { styles } = useStyles(stylesheet);
  const { getGuaranteedProfile } = useProfile();
  const profile = getGuaranteedProfile();
  const { vehicles, fetchVehicleById, refetchVehicleById } = useVehicles();
  const { documents, areDocumentsLoading, fetchDocuments } = useDocuments();
  const { vehicleId } = useLocalSearchParams<{ vehicleId: string }>();
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const closeModal = () => setActiveModal(null);
  const [vehicleIsLoading, setVehicleIsLoading] = useState(true);

  const fetchVehicle = async () => {
    setVehicleIsLoading(true);
    await fetchVehicleById(vehicleId);
    setVehicleIsLoading(false);
  };

  const refetchVehicle = async () => {
    setVehicleIsLoading(true);
    await refetchVehicleById(vehicleId);
    setVehicleIsLoading(false);
  };

  useEffect(() => {
    fetchVehicle();
  }, [vehicleId]);

  if (vehicleIsLoading || areDocumentsLoading) {
    return <FetchingIndicator caption={vehicleIsLoading ? "Cargando vehículo" : "Cargando documentos"} />;
  }

  if (!vehicles) {
    return (
      <ErrorScreen
        caption="Ocurrió un error al cargar los vehículos"
        buttonCaption="Reintentar"
        retryFunction={fetchVehicle}
      />
    );
  }

  const vehicle = vehicles[vehicleId];

  if (!vehicle) {
    return (
      <>
        <Stack.Screen options={{ title: "Recurso inaccesible", headerLargeTitle: false }} />
        <UnauthorizedScreen
          caption="No tienes acceso a este recurso."
          buttonCaption="Reintentar"
          retryFunction={refetchVehicle}
        />
      </>
    );
  }

  if (!documents) {
    return (
      <ErrorScreen
        caption="Ocurrió un error al cargar los documentos"
        buttonCaption="Reintentar"
        retryFunction={fetchDocuments}
      />
    );
  }

  const associatedDocuments = documents.filter((doc) => doc.vehicle_id === vehicleId);
  const canEdit = profile.role === "ADMIN" || profile.role === "OWNER";

  return (
    <>
      <Modal isOpen={activeModal === "add_document"} close={closeModal}>
        <AddDocumentModal closeModal={closeModal} vehicle={vehicle} refreshDocuments={fetchDocuments} />
      </Modal>

      <Stack.Screen
        options={{
          title: "Guantera Digital",
          headerLargeTitle: false,
          headerRight: () => (
            <ActionButtonGroup>
              <ActionButton
                Icon={FilePlus}
                onPress={() => setActiveModal("add_document")}
                show={canEdit}
                text="Agregar documento"
              />
              <ActionButton
                onPress={() => {
                  refetchVehicle();
                  fetchDocuments();
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
        refreshing={vehicleIsLoading || areDocumentsLoading}
        onRefresh={() => {
          refetchVehicle();
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
