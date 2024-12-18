import React, { useState } from "react";
import EmptyScreen from "@/components/dataStates/EmptyScreen";
import ErrorScreen from "@/components/dataStates/ErrorScreen";
import { FetchingIndicator } from "@/components/dataStates/FetchingIndicator";
import UnauthorizedScreen from "@/components/dataStates/UnauthorizedScreen";
import StatusChip from "@/components/General/StatusChip";
import Modal from "@/components/Modal/Modal";
import AddMaintenance from "@/components/vehicles/modals/AddMaintenance";
import useVehicle from "@/hooks/truckHooks/useVehicle";
import useMaintenance from "@/hooks/useMaintenance";
import useProfile from "@/hooks/useProfile";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { useHeaderHeight } from "@react-navigation/elements";
import { Stack, useLocalSearchParams } from "expo-router";
import { Plus, ChevronRight } from "lucide-react-native";
import { FlatList, Platform, Text, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { ActionButtonGroup } from "@/components/actionButton/ActionButtonGroup";
import { ActionButton } from "@/components/actionButton/ActionButton";
import { SimpleList } from "@/components/simpleList/SimpleList";

type ModalType = "create_maintenance_record" | null;

export default function MaintenanceRequests() {
  const [currentTabIndex, setCurrentTabIndex] = useState(0);
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const { styles } = useStyles(stylesheet);
  const { vehicles, vehiclesAreLoading, fetchVehicles } = useVehicle();
  const { profile, isProfileLoading, fetchProfile } = useProfile();
  const { vehicleId } = useLocalSearchParams<{ vehicleId: string }>();
  const { maintenanceRecords, areMaintenanceRecordsLoading, fetchMaintenance } =
    useMaintenance(vehicleId);
  const headerHeight = useHeaderHeight();

  const closeModal = () => setActiveModal(null);

  if (isProfileLoading || vehiclesAreLoading || areMaintenanceRecordsLoading) {
    return (
      <>
        <Stack.Screen
          options={{
            title: "Cargando...",
            headerLargeTitle: false,
          }}
        />
        <FetchingIndicator caption="Cargando datos..." />
      </>
    );
  }

  if (!profile) {
    return (
      <ErrorScreen
        caption="Ocurrió un error al recuperar tu perfil"
        buttonCaption="Reintentar"
        retryFunction={fetchProfile}
      />
    );
  }

  if (!vehicles) {
    return (
      <ErrorScreen
        caption="Ocurrió un error al cargar los vehículos"
        buttonCaption="Reintentar"
        retryFunction={fetchVehicles}
      />
    );
  }

  const vehicle = vehicles.find((v) => v.id === vehicleId);

  if (!vehicle) {
    return (
      <UnauthorizedScreen
        caption="No tienes acceso a este recurso."
        buttonCaption="Reintentar"
        retryFunction={fetchVehicles}
      />
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
      <Modal isOpen={activeModal === "create_maintenance_record"}>
        <View style={styles.modalContainer}>
          <Text style={styles.closeButton} onPress={closeModal}>
            Cerrar
          </Text>
          <AddMaintenance
            closeModal={closeModal}
            fetchMaintenance={fetchMaintenance}
            vehicle={vehicle}
            profile={profile}
          />
        </View>
      </Modal>

      <Stack.Screen
        options={{
          title: "Solicitudes de mantenimiento",
          headerLargeTitle: false,
          headerRight: () => (
            <ActionButtonGroup>
              <ActionButton
                Icon={Plus}
                onPress={() => setActiveModal("create_maintenance_record")}
                show={canEdit}
              />
            </ActionButtonGroup>
          ),
        }}
      />

      <SegmentedControl
        values={["Todo", "Recibidos", "En revisión", "Resueltas"]}
        selectedIndex={currentTabIndex}
        onChange={(event) =>
          setCurrentTabIndex(event.nativeEvent.selectedSegmentIndex)
        }
        style={[
          styles.segmentedControl,
          { marginTop: Platform.OS === "ios" ? headerHeight + 6 : 6 },
        ]}
      />

      <FlatList
        data={filteredMaintenanceRecords}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SimpleList
            href={`/vehicles/${vehicleId}/maintenance/${item.id}`}
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
            trailing={<ChevronRight color={styles.chevron.color} />}
          />
        )}
        ListEmptyComponent={() => (
          <EmptyScreen caption="No hay solicitudes de mantenimiento con este filtro" />
        )}
        refreshing={vehiclesAreLoading || areMaintenanceRecordsLoading}
        onRefresh={() => {
          fetchVehicles();
          fetchProfile();
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
  chevron: {
    color: theme.textPresets.subtitle,
  },
}));
