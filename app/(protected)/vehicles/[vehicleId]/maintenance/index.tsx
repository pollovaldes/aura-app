import React from "react";
import EmptyScreen from "@/components/dataStates/EmptyScreen";
import ErrorScreen from "@/components/dataStates/ErrorScreen";
import { SkeletonLoading } from "@/components/dataStates/SkeletonLoading";
import UnauthorizedScreen from "@/components/dataStates/UnauthorizedScreen";
import StatusChip from "@/components/General/StatusChip";
import Modal from "@/components/Modal/Modal";
import AddMaintenance from "@/components/vehicles/modals/AddMaintenance";
import useVehicle from "@/hooks/truckHooks/useVehicle";
import useMaintenance from "@/hooks/useMaintenance";
import useProfile from "@/hooks/useProfile";
import { User } from "@/types/User";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { useHeaderHeight } from "@react-navigation/elements";
import { Link, Stack, useLocalSearchParams } from "expo-router";
import { ChevronRight, Plus } from "lucide-react-native";
import { useState } from "react";
import { FlatList, Platform, Pressable, Text, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

type ModalType = "create_maintenance_record" | null;

export default function Index() {
  const [currentTabIndex, setCurrentTabIndex] = useState(0);
  const { styles } = useStyles(stylesheet);
  const { vehicles, vehiclesAreLoading, fetchVehicles } = useVehicle();
  const { profile, isProfileLoading, fetchProfile } = useProfile();
  const { vehicleId } = useLocalSearchParams<{ vehicleId: string }>();
  const { maintenanceRecords, areMaintenanceRecordsLoading, fetchMaintenance } =
    useMaintenance(vehicleId);
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const closeModal = () => setActiveModal(null);
  const headerHeight = useHeaderHeight();

  if (isProfileLoading || vehiclesAreLoading || areMaintenanceRecordsLoading) {
    return (
      <>
        <Stack.Screen
          options={{
            title: "Cargando...",
            headerLargeTitle: false,
            headerRight: undefined,
          }}
        />
        <SkeletonLoading />
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

  const vehicle = vehicles.find((Vehicle) => Vehicle.id === vehicleId);

  if (!vehicle) {
    return (
      <>
        <Stack.Screen
          options={{
            title: "Recurso inaccesible",
            headerRight: undefined,
            headerLargeTitle: false,
            headerTitle: undefined,
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

  if (!maintenanceRecords) {
    return (
      <>
        <Stack.Screen
          options={{
            title: "Error",
            headerLargeTitle: false,
            headerRight: undefined,
          }}
        />
        <UnauthorizedScreen
          caption={`Ocurrió un error y no pudimos \ncargar las solicitudes de mantenimiento`}
          buttonCaption="Reintentar"
          retryFunction={fetchMaintenance}
        />
      </>
    );
  }

  const currentVechicleMaintenanceRecords = maintenanceRecords.filter(
    (record) => record.vehicle_id === vehicle.id
  );

  if (currentVechicleMaintenanceRecords.length != 0) {
    const uuids = currentVechicleMaintenanceRecords.map(
      (record) => record.issued_by
    );
  }

  function formatDate(dateString: string, prefix: string) {
    const date = new Date(dateString);

    const day = date.getDate();
    const month = date.toLocaleString("es", { month: "long" }); // Get month in Spanish
    const year = date.getFullYear();

    const hours = date.getHours().toString().padStart(2, "0"); // Add leading zero
    const minutes = date.getMinutes().toString().padStart(2, "0"); // Add leading zero

    return `${prefix}${day} de ${month} del ${year} a las ${hours}:${minutes} horas`;
  }

  const canEdit =
    profile.role === "ADMIN" ||
    profile.role === "OWNER" ||
    profile.role === "DRIVER";

  const statesConfig = {
    IN_REVISION: {
      text: "En revisión",
      backgroundColor: "#e3f2fd", // Azul claro
      textColor: "#1e88e5", // Azul
    },
    PENDING_REVISION: {
      text: "Recibido",
      backgroundColor: "#fff3e0", // Naranja claro
      textColor: "#ef6c00", // Naranja
    },
    SOLVED: {
      text: "Resuelto",
      backgroundColor: "#e8f5e9", // Verde claro
      textColor: "#2e7d32", // Verde
    },
  };

  const filteredMaintenanceRecords = currentVechicleMaintenanceRecords.filter(
    (record) => {
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
    }
  );

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
      {currentVechicleMaintenanceRecords.length === 0 ? (
        <>
          <Stack.Screen
            options={{
              title: "Solicitudes de mantenimiento",
              headerLargeTitle: false,
              headerTitle: undefined,
              headerRight: () =>
                canEdit && (
                  <Pressable
                    onPress={() => setActiveModal("create_maintenance_record")}
                  >
                    <Plus color={styles.plusIcon.color} />
                  </Pressable>
                ),
            }}
          />
          <EmptyScreen
            caption={"No hay solicitudes de mantenimiento\npara este vehículo"}
            retryFunction={fetchMaintenance}
            buttonCaption="Reintentar"
          />
        </>
      ) : (
        <>
          <Stack.Screen
            options={{
              title: "Solicitudes de mantenimiento",
              headerLargeTitle: false,
              headerRight: () =>
                canEdit && (
                  <Pressable
                    onPress={() => setActiveModal("create_maintenance_record")}
                  >
                    <Plus color={styles.plusIcon.color} />
                  </Pressable>
                ),
            }}
          />
          <SegmentedControl
            values={["Todo", "Recibidos", "En revisión", "Resuletas"]}
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
            refreshing={
              vehiclesAreLoading ||
              areMaintenanceRecordsLoading ||
              isProfileLoading
            }
            onRefresh={() => {
              fetchVehicles();
              fetchProfile();
              fetchMaintenance();
            }}
            contentInsetAdjustmentBehavior="automatic"
            data={filteredMaintenanceRecords}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Link
                href={{
                  pathname: `/vehicles/${vehicleId}/maintenance/${item.id}`,
                }}
                asChild
              >
                <Pressable>
                  <View style={styles.container}>
                    <View style={styles.contentContainer}>
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <StatusChip
                          status={item.status}
                          statesConfig={statesConfig}
                        />
                        <Text style={styles.title}>{item.title}</Text>
                      </View>
                      <View>
                        <Text style={styles.subtitle}>
                          {(() => {
                            const {
                              issued_by,
                              issued_datetime,
                              resolved_by,
                              resolved_datetime,
                              status,
                            } = item;

                            const getFullName = (user: User | null): string => {
                              return user
                                ? `${user.name} ${user.father_last_name} ${user.mother_last_name}`.trim()
                                : "un usuario desconocido";
                            };

                            const issuedByName = getFullName(issued_by);
                            const issuedDate = issued_datetime
                              ? formatDate(issued_datetime, "el ")
                              : "una fecha desconocida";

                            if (status === "SOLVED") {
                              const resolvedByName = getFullName(resolved_by!);
                              const resolvedDate = resolved_datetime
                                ? formatDate(resolved_datetime, "el ")
                                : "una fecha desconocida";

                              return `Esta solicitud fue hecha por ${issuedByName} ${issuedDate} y fue resuelta ${resolvedDate} por ${resolvedByName}`;
                            }

                            return `Esta solicitud fue hecha por ${issuedByName} ${issuedDate}`;
                          })()}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.chevronView}>
                      <ChevronRight color={styles.chevron.color} />
                    </View>
                  </View>
                </Pressable>
              </Link>
            )}
            ListEmptyComponent={() => (
              <View
                style={{
                  height: 250,
                }}
              >
                <EmptyScreen
                  caption={
                    "No hay solicitudes de mantenimiento\ncon este filtro"
                  }
                />
              </View>
            )}
          />
        </>
      )}
    </>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  segmentedControl: {
    width: "97%",
    margin: "auto",
    marginBottom: 6,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: theme.ui.colors.border,
    padding: 12,
  },
  contentContainer: {
    gap: 6,
    flexDirection: "column",
    flex: 1,
    marginHorizontal: 12,
  },
  title: {
    fontSize: 17,
    fontWeight: "bold",
    paddingLeft: 10,
    color: theme.textPresets.main,
    marginRight: 120,
  },
  subtitle: {
    color: theme.textPresets.subtitle,
    fontSize: 15,
  },
  plusIcon: {
    fontSize: 16,
    color: theme.headerButtons.color,
  },
  chevron: {
    color: theme.textPresets.subtitle,
  },
  chevronView: {
    paddingRight: 12,
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
  status: {
    marginRight: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
}));
