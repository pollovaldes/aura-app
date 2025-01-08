// VehicleTechnicalSheet.tsx

import React, { useEffect, useState } from "react";
import { View, ScrollView, RefreshControl, Text, Platform } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { FetchingIndicator } from "@/components/dataStates/FetchingIndicator";
import { useVehicle } from "@/hooks/truckHooks/useVehicle";
import useProfile from "@/hooks/useProfile";
import ErrorScreen from "@/components/dataStates/ErrorScreen";
import UnauthorizedScreen from "@/components/dataStates/UnauthorizedScreen";
import ChangeDataModal from "@/components/Modal/ChangeDataModal";
import Modal from "@/components/Modal/Modal";
import Row from "@/components/grouped-list/Row";
import GroupedList from "@/components/grouped-list/GroupedList";
import { ActionButtonGroup } from "@/components/actionButton/ActionButtonGroup";
import { ActionButton } from "@/components/actionButton/ActionButton";
import { RotateCcw, RotateCw } from "lucide-react-native";

type ModalType = "numero_economico" | "marca" | "sub_marca" | "modelo" | "no_serie" | "placa" | null;

export function VehicleTechnicalSheet() {
  const { styles } = useStyles(stylesheet);
  const { getGuaranteedProfile } = useProfile();
  const profile = getGuaranteedProfile();
  const { vehicles, fetchVehicleById, refetchVehicleById } = useVehicle();
  const { vehicleId } = useLocalSearchParams<{ vehicleId: string }>();
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [vehicleIsLoading, setVehicleIsLoading] = useState(true);

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
    } catch (error) {
      console.error("Error refetching vehicle:", error);
      throw error;
    } finally {
      setVehicleIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicle();
  }, []);

  if (vehicleIsLoading) {
    return <FetchingIndicator caption="Cargando vehículo" />;
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

  const canEdit = profile.role === "ADMIN" || profile.role === "OWNER";
  const isChevronVisible = !canEdit;

  const openModal = (modalType: ModalType) => {
    if (canEdit) {
      setActiveModal(modalType);
    }
  };

  return (
    <>
      <Modal isOpen={activeModal !== null} close={setActiveModal.bind(null, null)}>
        {activeModal && (
          <ChangeDataModal
            currentDataType={
              activeModal === "numero_economico"
                ? "Número Económico"
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
            closeModal={() => setActiveModal(null)}
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
        )}
      </Modal>

      <Stack.Screen
        options={{
          title: "Ficha técnica",
          headerLargeTitle: true,
          headerRight: () => (
            <ActionButtonGroup>
              <ActionButton show={canEdit} onPress={refetchVehicle} text="Actualizar" Icon={RotateCw} />
            </ActionButtonGroup>
          ),
        }}
      />

      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        refreshControl={<RefreshControl refreshing={vehicleIsLoading} onRefresh={refetchVehicle} />}
      >
        <View style={styles.container}>
          <GroupedList
            header="Detalles"
            footer="Contacta a tu administrador para más información o a tu supervisor para reportar errores. Solo los administradores pueden editar la información del camión."
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
