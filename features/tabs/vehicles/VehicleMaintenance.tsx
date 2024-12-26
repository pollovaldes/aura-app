import React, { useEffect, useState } from "react";
import EmptyScreen from "@/components/dataStates/EmptyScreen";
import ErrorScreen from "@/components/dataStates/ErrorScreen";
import { FetchingIndicator } from "@/components/dataStates/FetchingIndicator";
import UnauthorizedScreen from "@/components/dataStates/UnauthorizedScreen";
import StatusChip from "@/components/General/StatusChip";
import Modal from "@/components/Modal/Modal";
import useMaintenance from "@/hooks/useMaintenance";
import useProfile from "@/hooks/useProfile";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { Stack, useLocalSearchParams } from "expo-router";
import { Download, FilterIcon, Plus, RotateCw } from "lucide-react-native";
import { FlatList, Platform, Text } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { ActionButtonGroup } from "@/components/actionButton/ActionButtonGroup";
import { ActionButton } from "@/components/actionButton/ActionButton";
import { SimpleList } from "@/components/simpleList/SimpleList";
import { useVehicle } from "@/hooks/truckHooks/useVehicle";
import { AddMaintenanceModal } from "./modals/AddMaintenanceModal";

type ModalType = "create_maintenance_record" | null;

export default function VehicleMaintenance() {
  const [currentTabIndex, setCurrentTabIndex] = useState(0);
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const { styles } = useStyles(stylesheet);
  const { vehicles, fetchVehicleById, refetchVehicleById } = useVehicle();
  const { getGuaranteedProfile } = useProfile();
  const profile = getGuaranteedProfile();
  const { vehicleId } = useLocalSearchParams<{ vehicleId: string }>();
  const { maintenanceRecords, areMaintenanceRecordsLoading, fetchMaintenance } = useMaintenance(vehicleId);
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
  }, []);

  if (vehicleIsLoading || areMaintenanceRecordsLoading) {
    return (
      <FetchingIndicator caption={vehicleIsLoading ? "Cargando vehículo" : "Cargando solicitudes de mantenimiento"} />
    );
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

  const vehicle = vehicles.find((Vehicle) => Vehicle.id === vehicleId);

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

  if (!maintenanceRecords) {
    return (
      <ErrorScreen
        caption="Ocurrió un error al cargar las solicitudes de mantenimiento"
        buttonCaption="Reintentar"
        retryFunction={fetchMaintenance}
      />
    );
  }

  const filteredMaintenanceRecords = maintenanceRecords.filter((record) => {
    switch (currentTabIndex) {
      case 1:
        return record.status === "PENDING_REVISION";
      case 2:
        return record.status === "IN_REVISION";
      case 3:
        return record.status === "SOLVED";
      default:
        return true;
    }
  });

  const formatDate = (dateString: string, prefix: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("es", { month: "long" });
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${prefix}${day} de ${month} del ${year} a las ${hours}:${minutes} horas`;
  };

  const canEdit = ["ADMIN", "OWNER", "DRIVER"].includes(profile.role);

  const statesConfig = {
    IN_REVISION: {
      text: "En revisión",
      backgroundColor: "#e3f2fd",
      textColor: "#1e88e5",
    },
    PENDING_REVISION: {
      text: "Recibido",
      backgroundColor: "#fff3e0",
      textColor: "#ef6c00",
    },
    SOLVED: {
      text: "Resuelto",
      backgroundColor: "#e8f5e9",
      textColor: "#2e7d32",
    },
  };

  return (
    <>
      <Modal isOpen={activeModal === "create_maintenance_record"} close={closeModal}>
        <AddMaintenanceModal
          closeModal={closeModal}
          fetchMaintenance={fetchMaintenance}
          vehicle={vehicle}
          profile={profile}
        />
      </Modal>

      <Stack.Screen
        options={{
          title: "Solicitudes de mantenimiento",
          headerLargeTitle: false,
          headerRight: () => (
            <ActionButtonGroup>
              <ActionButton Icon={Download} text="CSV" onPress={() => {}} show={canEdit} />
              <ActionButton Icon={FilterIcon} text="Filtros" onPress={() => {}} show={canEdit} />
              <ActionButton
                Icon={Plus}
                text="Nueva solicitud"
                onPress={() => setActiveModal("create_maintenance_record")}
                show={canEdit}
              />
              <ActionButton
                onPress={() => {
                  fetchMaintenance();
                  fetchVehicle();
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
        contentInsetAdjustmentBehavior="automatic"
        data={filteredMaintenanceRecords}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SimpleList
            relativeToDirectory
            href={`./${item.id}`}
            leading={
              <>
                <StatusChip status={item.status} statesConfig={statesConfig} />
              </>
            }
            content={
              <>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.subtitle}>
                  {(() => {
                    const issuedDate = item.issued_datetime
                      ? formatDate(item.issued_datetime, "el ")
                      : "una fecha desconocida";
                    return `Creado el ${issuedDate}`;
                  })()}
                </Text>
              </>
            }
          />
        )}
        ListHeaderComponent={
          <SegmentedControl
            values={["Todo", "Recibidos", "En revisión", "Resueltas"]}
            selectedIndex={currentTabIndex}
            onChange={(event) => setCurrentTabIndex(event.nativeEvent.selectedSegmentIndex)}
            style={styles.segmentedControl}
          />
        }
        ListEmptyComponent={() => <EmptyScreen caption="No hay solicitudes de mantenimiento con este filtro" />}
        refreshing={vehicleIsLoading || areMaintenanceRecordsLoading}
        onRefresh={() => {
          fetchVehicle();
          fetchMaintenance();
        }}
      />
    </>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  segmentedControl: {
    width: "97%",
    margin: "auto",
    marginBottom: 6,
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
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.textPresets.main,
  },
  subtitle: {
    color: theme.textPresets.subtitle,
    fontSize: 15,
  },
}));
