import React, { useEffect, useState } from "react";
import { View, ScrollView, RefreshControl, Text, Platform } from "react-native";
import { Stack, useLocalSearchParams, router } from "expo-router";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { FetchingIndicator } from "@/components/dataStates/FetchingIndicator";
import { useVehicle } from "@/hooks/truckHooks/useVehicle";
import { colorPalette } from "@/style/themes";
import { formatDate } from "@/features/global/functions/formatDate";
import useProfile from "@/hooks/useProfile";
import ErrorScreen from "@/components/dataStates/ErrorScreen";
import UnauthorizedScreen from "@/components/dataStates/UnauthorizedScreen";
import Row from "@/components/grouped-list/Row";
import { CircleHelp, Info, MessageCirclePlus, RefreshCcw, Trash } from "lucide-react-native";
import ChangeDataModal from "@/components/Modal/ChangeDataModal";
import Modal from "@/components/Modal/Modal";
import GroupedList from "@/components/grouped-list/GroupedList";
import StatusChip from "@/components/General/StatusChip";

type ModalType = "numero_economico" | "marca" | "sub_marca" | "modelo" | "no_serie" | "placa" | null;

export function VehicleMaintenanceDetails() {
  const { styles } = useStyles(stylesheet);
  const { getGuaranteedProfile } = useProfile();
  const profile = getGuaranteedProfile();
  const { vehicles, fetchVehicleById, refetchVehicleById } = useVehicle();
  const { maintenanceId, vehicleId } = useLocalSearchParams<{ maintenanceId: string; vehicleId: string }>();

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

  const canEdit = ["ADMIN", "OWNER", "DRIVER"].includes(profile.role);

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
          retryFunction={refetchVehicle}
        />
      </>
    );
  }

  const record = vehicle.maintenanceRecords?.find((rec) => rec.id === maintenanceId);

  if (!record) {
    return (
      <ErrorScreen
        caption="Ocurrió un error y no pudimos cargar los detalles de mantenimiento"
        buttonCaption="Reintentar"
        retryFunction={refetchVehicle}
      />
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "Ficha técnica",
          headerLargeTitle: true,
          headerRight: () =>
            canEdit && (
              <View style={styles.headerRight}>
                <Row
                  title="Actualizar"
                  onPress={refetchVehicle}
                  hideChevron
                  icon={RefreshCcw}
                  backgroundColor={colorPalette.green[500]}
                />
                <Row
                  title="Eliminar solicitud"
                  onPress={() => {}}
                  hideChevron
                  icon={Trash}
                  backgroundColor={colorPalette.red[500]}
                />
              </View>
            ),
        }}
      />

      <Modal isOpen={activeModal !== null} close={() => setActiveModal(null)}>
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

      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        refreshControl={<RefreshControl refreshing={vehicleIsLoading} onRefresh={refetchVehicle} />}
      >
        <View style={styles.container}>
          <GroupedList
            header="Detalles de la solicitud"
            footer="Contacta a tu administrador para más información o a tu supervisor para reportar errores. Solo los administradores pueden editar la información del camión."
          >
            <Row
              title="Estatus de la solicitud"
              trailing={<StatusChip status={record.status} statesConfig={statesConfig} />}
              icon={CircleHelp}
              backgroundColor={colorPalette.orange[500]}
            />
            <Row
              title="Descripción general"
              caption={record.title || "No se proveyó ningún título."}
              icon={Info}
              backgroundColor={colorPalette.cyan[500]}
              hideChevron
            />
            <Row>
              <Text style={styles.headerDescription}>
                {record.description || "No se proveyó ninguna descripción para esta solicitud de mantenimiento."}
              </Text>
            </Row>
          </GroupedList>

          <GroupedList header="Información sobre la petición">
            <Row
              title="Inicio de la solicitud"
              caption={
                record.issued_datetime ? formatDate(record.issued_datetime, "Iniciada el ") : "Fecha no registrada."
              }
              hideChevron
            />
            <Row
              title="Vehículo al que se le solicitó"
              caption={`${vehicle.brand} ${vehicle.sub_brand} (${vehicle.year})`}
              onPress={() => router.push(`/tab/vehicle_details/${vehicle.id}`)}
            />
            <Row
              title="Quién solicitó"
              caption={`${record.issued_by.name} ${record.issued_by.father_last_name} ${record.issued_by.mother_last_name}`}
              onPress={() => {
                router.push(`/tab/user_details/${record.issued_by.id}`);
              }}
            />
          </GroupedList>

          {record.status === "SOLVED" && (
            <GroupedList header="Información sobre la resolución">
              <Row
                title="Fecha de resolución"
                caption={
                  record.resolved_datetime
                    ? formatDate(record.resolved_datetime, "Finalizada el ")
                    : "No se registró la fecha de resolución."
                }
                hideChevron
              />
              <Row
                title="Quién resolvió"
                caption={
                  record.resolved_by
                    ? `${record.resolved_by.name} ${record.resolved_by.father_last_name} ${record.resolved_by.mother_last_name}`
                    : "No se registró quién resolvió la solicitud."
                }
                onPress={() => {
                  if (record.resolved_by) {
                    router.push(`/tab/user_details/${record.resolved_by.id}`);
                  }
                }}
                hideChevron={!record.resolved_by}
              />
            </GroupedList>
          )}

          <GroupedList header="Acciones para esta solicitud">
            <Row
              title="Cambiar el estatus de la solicitud"
              icon={RefreshCcw}
              backgroundColor={colorPalette.green[500]}
              onPress={() => {}}
            />
            <Row
              title="Agregar comentario"
              icon={MessageCirclePlus}
              backgroundColor={colorPalette.neutral[500]}
              onPress={() => {}}
            />
            <Row title="Eliminar solicitud" icon={Trash} backgroundColor={colorPalette.red[500]} onPress={() => {}} />
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
  headerDescription: {
    color: theme.textPresets.main,
    fontSize: 16,
  },
  segmentedControl: {
    width: "97%",
    marginHorizontal: "auto",
    marginVertical: 6,
  },
  groupedListsContainer: {
    gap: theme.marginsComponents.section,
    marginTop: 6,
    marginBottom: 36,
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
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginRight: 10,
  },
}));
