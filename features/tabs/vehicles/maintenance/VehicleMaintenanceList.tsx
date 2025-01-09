import React, { useEffect, useState } from "react";
import { FlatList, Text, View, Platform, Alert } from "react-native";
import { Stack, useLocalSearchParams, router } from "expo-router";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { Download, FilterIcon, Plus, RotateCw, Trash } from "lucide-react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { ActionButtonGroup } from "@/components/actionButton/ActionButtonGroup";
import { ActionButton } from "@/components/actionButton/ActionButton";
import { SimpleList } from "@/components/simpleList/SimpleList";
import StatusChip from "@/components/General/StatusChip";
import Modal from "@/components/Modal/Modal";
import EmptyScreen from "@/components/dataStates/EmptyScreen";
import ErrorScreen from "@/components/dataStates/ErrorScreen";
import UnauthorizedScreen from "@/components/dataStates/UnauthorizedScreen";
import { FetchingIndicator } from "@/components/dataStates/FetchingIndicator";
import { useVehicles } from "@/hooks/truckHooks/useVehicle";
import { colorPalette } from "@/style/themes";
import { formatDate } from "@/features/global/functions/formatDate";
import { AddMaintenanceModal } from "../modals/AddMaintenanceModal";
import useProfile from "@/hooks/useProfile";
import useMaintenance from "@/hooks/useMaintenance";
import { supabase } from "@/lib/supabase";

type ModalType = "create_maintenance_record" | null;

export function VehicleMaintenanceList() {
  const { styles } = useStyles(stylesheet);
  const { getGuaranteedProfile } = useProfile();
  const profile = getGuaranteedProfile();
  const { vehicles, fetchVehicleById, refetchVehicleById } = useVehicles();
  const { vehicleId, maintenanceId } = useLocalSearchParams<{ maintenanceId: string; vehicleId: string }>();
  const { maintenanceRecords, areMaintenanceRecordsLoading, fetchMaintenance } = useMaintenance(vehicleId);
  const [currentTabIndex, setCurrentTabIndex] = useState(0);
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [vehicleIsLoading, setVehicleIsLoading] = useState(true);

  const canEdit = ["ADMIN", "OWNER", "DRIVER"].includes(profile.role);

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
      await fetchMaintenance();
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

  const openModal = (modalType: ModalType) => {
    if (canEdit) {
      setActiveModal(modalType);
    }
  };

  const handleDeleteMaintenance = async (maintenanceId: string) => {
    Alert.alert("Confirmación", `¿Estás seguro de eliminar esta solicitud de mantenimiento?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          try {
            const { error } = await supabase.from("maintenance_records").delete().eq("id", maintenanceId);

            if (error) {
              console.error("Error deleting maintenance record:", error);
              throw error;
            }

            await fetchMaintenance();
            router.back();
          } catch (error) {
            console.error("Error deleting maintenance record:", error);
            Alert.alert("Error", "No se pudo eliminar la solicitud de mantenimiento.");
          }
        },
      },
    ]);
  };

  return (
    <>
      <Modal isOpen={activeModal === "create_maintenance_record"} close={() => setActiveModal(null)}>
        <AddMaintenanceModal
          closeModal={() => setActiveModal(null)}
          fetchMaintenance={fetchMaintenance}
          vehicle={vehicle}
          profile={profile}
        />
      </Modal>

      <Stack.Screen
        options={{
          title: "Solicitudes de mantenimiento",
          headerLargeTitle: false,
          headerRight: () =>
            canEdit && (
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
                  Icon={RotateCw}
                  text="Actualizar"
                  onPress={() => {
                    fetchMaintenance();
                    fetchVehicle();
                  }}
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
        ListHeaderComponent={
          <SegmentedControl
            values={["Todo", "Recibidos", "En revisión", "Resueltas"]}
            selectedIndex={currentTabIndex}
            onChange={(event) => setCurrentTabIndex(event.nativeEvent.selectedSegmentIndex)}
            style={styles.segmentedControl}
          />
        }
        renderItem={({ item }) => (
          <SimpleList
            relativeToDirectory
            href={`./${item.id}`}
            leading={<StatusChip status={item.status} statesConfig={statesConfig} />}
            content={
              <View style={{ flexDirection: "column" }}>
                <Text style={styles.title}>{item.title || "No se proveyó ningún título."}</Text>
                <Text style={styles.subtitle}>
                  {item.issued_datetime
                    ? formatDate(item.issued_datetime, "Creado el ")
                    : "Creado en una fecha desconocida"}
                </Text>
              </View>
            }
            trailing={
              canEdit && (
                <Trash
                  size={20}
                  color={colorPalette.red[500]}
                  onPress={() => handleDeleteMaintenance(item.id)}
                  style={{ marginLeft: 10 }}
                />
              )
            }
          />
        )}
        ListEmptyComponent={<EmptyScreen caption="No hay solicitudes de mantenimiento con este filtro" />}
        refreshing={vehicleIsLoading || areMaintenanceRecordsLoading}
        onRefresh={() => {
          refetchVehicle();
          fetchMaintenance();
        }}
      />
    </>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  segmentedControl: {
    width: "97%",
    marginHorizontal: "auto",
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
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginRight: 10,
  },
}));
