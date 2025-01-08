import React, { useEffect, useState } from "react";
import { View, ScrollView, RefreshControl, Platform } from "react-native";
import { router, Stack, useLocalSearchParams, useNavigation } from "expo-router";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { ActionButton } from "@/components/actionButton/ActionButton";
import { ActionButtonGroup } from "@/components/actionButton/ActionButtonGroup";
import { FetchingIndicator } from "@/components/dataStates/FetchingIndicator";
import { SimpleList } from "@/components/simpleList/SimpleList";
import { AddDocumentModal } from "@/features/tabs/vehicles/modals/AddDocumentModal";
import { useVehicle } from "@/hooks/truckHooks/useVehicle";
import { supabase } from "@/lib/supabase";
import { FilePlus, RotateCw, Trash } from "lucide-react-native";
import useProfile from "@/hooks/useProfile";
import useDocuments from "@/hooks/useDocuments";
import ErrorScreen from "@/components/dataStates/ErrorScreen";
import UnauthorizedScreen from "@/components/dataStates/UnauthorizedScreen";
import Modal from "@/components/Modal/Modal";
import ChangeDataModal from "@/components/Modal/ChangeDataModal";
import Row from "@/components/grouped-list/Row";
import GroupedList from "@/components/grouped-list/GroupedList";
import { ConfirmDialog } from "@/components/alert/ConfirmDialog";

type ModalType = "add_document" | "numero_economico" | "marca" | "sub_marca" | "modelo" | "no_serie" | "placa" | null;

export function VehicleManageFleets() {
  const { styles } = useStyles(stylesheet);
  const { getGuaranteedProfile } = useProfile();
  const profile = getGuaranteedProfile();
  const { vehicles, fetchVehicleById, refetchVehicleById } = useVehicle();
  const { documents, areDocumentsLoading, fetchDocuments } = useDocuments();
  const { vehicleId } = useLocalSearchParams<{ vehicleId: string }>();
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const closeModal = () => setActiveModal(null);
  const [vehicleIsLoading, setVehicleIsLoading] = useState(true);
  const navigation = useNavigation();

  const fetchVehicle = async () => {
    setVehicleIsLoading(true);
    try {
      await fetchVehicleById(vehicleId);
    } catch (error) {
      console.error("Error fetching vehicle:", error);
      throw error;
    } finally {
      setVehicleIsLoading(false);
    }
  };

  const refetchVehicle = async () => {
    setVehicleIsLoading(true);
    try {
      await refetchVehicleById(vehicleId);
      await fetchDocuments();
    } catch (error) {
      console.error("Error refetching vehicle:", error);
      throw error;
    } finally {
      setVehicleIsLoading(false);
    }
  };

  useEffect(() => {
    navigation.setOptions({
      presentation: undefined,
    });
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
          retryFunction={fetchVehicle}
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
  const isChevronVisible = !canEdit;

  const openModal = (modalType: ModalType) => {
    if (canEdit) {
      setActiveModal(modalType);
    }
  };

  const deleteVehicle = ConfirmDialog({
    title: "Confirmación",
    message: `¿Estás seguro de eliminar el vehículo "${vehicle.brand ?? ""} ${vehicle.sub_brand ?? ""} (${vehicle.year ?? ""})"?\nEsta acción borrará permanentemente sus rutas, historiales, documentos, etc.`,
    cancelText: "Cancelar",
    confirmText: "Eliminar",
    confirmStyle: "destructive",
    onConfirm: async () => {
      const { error } = await supabase.from("vehicles").delete().eq("id", vehicleId);

      if (error) {
        console.error("Error deleting vehicle:", error);
        throw error;
      }

      fetchVehicle();
      router.back();
    },
    onCancel: () => {},
  });

  return (
    <>
      <Modal isOpen={activeModal === "add_document"} close={closeModal}>
        <AddDocumentModal closeModal={closeModal} vehicle={vehicle} refreshDocuments={fetchDocuments} />
      </Modal>
      <Modal
        isOpen={["numero_economico", "marca", "sub_marca", "modelo", "no_serie", "placa"].includes(
          activeModal as ModalType
        )}
        close={closeModal}
      >
        <ChangeDataModal
          isOpen={true}
          currentDataType={
            activeModal === "numero_economico"
              ? "Numero Económico"
              : activeModal === "marca"
                ? "Marca"
                : activeModal === "sub_marca"
                  ? "Submarca"
                  : activeModal === "modelo"
                    ? "Modelo"
                    : activeModal === "no_serie"
                      ? "No. de serie"
                      : "No. de placa"
          }
          currentData={
            activeModal === "numero_economico"
              ? vehicle.economic_number
              : activeModal === "marca"
                ? vehicle.brand
                : activeModal === "sub_marca"
                  ? vehicle.sub_brand
                  : activeModal === "modelo"
                    ? vehicle.year
                    : activeModal === "no_serie"
                      ? vehicle.serial_number
                      : vehicle.plate
          }
          closeModal={closeModal}
          dataChange={
            activeModal === "numero_economico"
              ? "numero_economico"
              : activeModal === "marca"
                ? "marca"
                : activeModal === "sub_marca"
                  ? "sub_marca"
                  : activeModal === "modelo"
                    ? "modelo"
                    : activeModal === "no_serie"
                      ? "no_serie"
                      : "placa"
          }
          id={vehicle.id}
        />
      </Modal>

      <Stack.Screen
        options={{
          title: "Administrar Flotillas",
          headerLargeTitle: true,
          headerRight: () => (
            <ActionButtonGroup>
              <ActionButton
                Icon={FilePlus}
                onPress={() => openModal("add_document")}
                show={canEdit}
                text="Agregar documento"
              />
              <ActionButton
                onPress={() => {
                  refetchVehicle();
                }}
                Icon={RotateCw}
                text="Actualizar"
                show={Platform.OS === "web"}
              />
              {canEdit && (
                <ActionButton
                  Icon={Trash}
                  onPress={() => deleteVehicle.showDialog()}
                  show={canEdit}
                  text="Eliminar vehículo"
                />
              )}
            </ActionButtonGroup>
          ),
        }}
      />

      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        refreshControl={
          <RefreshControl
            refreshing={vehicleIsLoading || areDocumentsLoading}
            onRefresh={() => {
              refetchVehicle();
              fetchDocuments();
            }}
          />
        }
      >
        <View style={styles.container}>
          <GroupedList
            header="Detalles del Vehículo"
            footer="Contacta a tu administrador para más información o a tu supervisor para reportar errores. Solo los administradores pueden editar la información del vehículo."
          >
            <Row
              title="Número Económico"
              onPress={() => openModal("numero_economico")}
              caption={vehicle.economic_number ?? "N/A"}
              hideChevron={isChevronVisible}
            />
            <Row
              title="Marca"
              onPress={() => openModal("marca")}
              caption={vehicle.brand ?? "N/A"}
              hideChevron={isChevronVisible}
            />
            <Row
              title="Submarca"
              onPress={() => openModal("sub_marca")}
              caption={vehicle.sub_brand ?? "N/A"}
              hideChevron={isChevronVisible}
            />
            <Row
              title="Año"
              onPress={() => openModal("modelo")}
              caption={vehicle.year ?? "N/A"}
              hideChevron={isChevronVisible}
            />
            <Row
              title="Número de Serie"
              onPress={() => openModal("no_serie")}
              caption={vehicle.serial_number ?? "N/A"}
              hideChevron={isChevronVisible}
            />
            <Row
              title="Número de Placa"
              onPress={() => openModal("placa")}
              caption={vehicle.plate ?? "N/A"}
              hideChevron={isChevronVisible}
            />
          </GroupedList>
        </View>
      </ScrollView>
    </>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  container: {
    gap: theme.marginsComponents.section,
    marginTop: theme.marginsComponents.section,
    paddingHorizontal: 16,
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
