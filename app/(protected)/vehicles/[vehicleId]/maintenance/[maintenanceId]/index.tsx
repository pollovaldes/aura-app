import ErrorScreen from "@/components/dataStates/ErrorScreen";
import LoadingScreen from "@/components/dataStates/LoadingScreen";
import UnauthorizedScreen from "@/components/dataStates/UnauthorizedScreen";
import GroupedList from "@/components/grouped-list/GroupedList";
import Row from "@/components/grouped-list/Row";
import useVehicle from "@/hooks/truckHooks/useVehicle";
import useMaintenance from "@/hooks/useMaintenance";
import useProfile from "@/hooks/useProfile";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { useHeaderHeight } from "@react-navigation/elements";
import { router, Stack, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Platform, RefreshControl, ScrollView, Text, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { colorPalette } from "@/style/themes";
import {
  CircleHelp,
  File,
  Info,
  MessageCirclePlus,
  RefreshCcw,
  Trash,
} from "lucide-react-native";
import StatusChip from "@/components/General/StatusChip";
import useMaintenanceDocuments from "@/hooks/useMaintenanceDocuments";
import EmptyScreen from "@/components/dataStates/EmptyScreen";

export default function maintenanceId() {
  const { styles } = useStyles(stylesheet);

  const { vehicles, vehiclesAreLoading, fetchVehicles } = useVehicle();

  const { profile, isProfileLoading, fetchProfile } = useProfile();

  const { maintenanceId } = useLocalSearchParams<{ maintenanceId: string }>();

  const { maintenanceRecords, areMaintenanceRecordsLoading, fetchMaintenance } =
    useMaintenance(undefined, maintenanceId);

  const {
    areMaintenanceDocumentsLoading,
    fetchMaintenanceDocuments,
    maintenanceDocuments,
  } = useMaintenanceDocuments(maintenanceId);

  const headerHeight = useHeaderHeight();

  const [currentTabIndex, setCurrentTabIndex] = useState(0);

  if (isProfileLoading) {
    return (
      <>
        <Stack.Screen
          options={{
            title: "Cargando...",
            headerLargeTitle: false,
            headerRight: undefined,
          }}
        />
        <LoadingScreen caption="Cargando perfil y permisos" />
      </>
    );
  }

  if (areMaintenanceRecordsLoading) {
    return (
      <>
        <Stack.Screen
          options={{
            title: "Cargando...",
            headerLargeTitle: false,
            headerRight: undefined,
          }}
        />
        <LoadingScreen caption="Cargando solicitudes de mantenimiento" />
      </>
    );
  }

  if (areMaintenanceDocumentsLoading) {
    return (
      <>
        <Stack.Screen
          options={{
            title: "Cargando...",
            headerLargeTitle: false,
            headerRight: undefined,
          }}
        />
        <LoadingScreen caption="Cargando documentos" />
      </>
    );
  }

  if (vehiclesAreLoading) {
    return (
      <>
        <Stack.Screen
          options={{
            title: "Cargando...",
            headerLargeTitle: false,
            headerRight: undefined,
          }}
        />
        <LoadingScreen caption="Cargando vehículos" />
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

  if (!maintenanceDocuments) {
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
          caption={`Ocurrió un error y no pudimos \ncargar los documentos`}
          buttonCaption="Reintentar"
          retryFunction={fetchMaintenanceDocuments}
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

  console.log("maintennaceDocs" + maintenanceDocuments);

  const record = maintenanceRecords[0];

  const vehicle = vehicles.find((Vehicle) => Vehicle.id === record.vehicle_id);

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

  function formatDate(dateString: string, prefix: string) {
    const date = new Date(dateString);

    const day = date.getDate();
    const month = date.toLocaleString("es", { month: "long" }); // Get month in Spanish
    const year = date.getFullYear();

    const hours = date.getHours().toString().padStart(2, "0"); // Add leading zero
    const minutes = date.getMinutes().toString().padStart(2, "0"); // Add leading zero

    return `${prefix}${day} de ${month} del ${year} a las ${hours}:${minutes} horas`;
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "Detalles de la solicitud",
          headerLargeTitle: false,
        }}
      />
      <View
        style={[{ marginTop: Platform.OS === "ios" ? headerHeight + 0 : 6 }]}
      >
        <SegmentedControl
          values={["General", "Archivos y medios", "Actualizaciones"]}
          selectedIndex={currentTabIndex}
          onChange={(event) =>
            setCurrentTabIndex(event.nativeEvent.selectedSegmentIndex)
          }
          style={[styles.segmentedControl, {}]}
        />
      </View>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        refreshControl={
          <RefreshControl
            refreshing={
              vehiclesAreLoading ||
              areMaintenanceRecordsLoading ||
              isProfileLoading ||
              areMaintenanceDocumentsLoading
            }
            onRefresh={() => {
              fetchVehicles();
              fetchProfile();
              fetchMaintenance();
              fetchMaintenanceDocuments();
            }}
          />
        }
      >
        {currentTabIndex === 0 && (
          <View style={styles.groupedListsContainer}>
            <GroupedList>
              <Row
                title="Estatus de la solicitud"
                trailingType="chevron"
                caption={() => {
                  return (
                    <StatusChip
                      status={record.status}
                      statesConfig={statesConfig}
                    />
                  );
                }}
                icon={<CircleHelp size={24} color="white" />}
                color={colorPalette.orange[500]}
              />
              <Row
                title="Descripción general"
                trailingType="chevron"
                showChevron={false}
                caption={record.title}
                icon={<Info size={24} color="white" />}
                color={colorPalette.cyan[500]}
              />
              <Row
                trailingType="chevron"
                title=""
                onPress={() => {}}
                showChevron={false}
              >
                <Text style={styles.haderDescription}>
                  {record.description === ""
                    ? "No se proveyó ninguna descripción para esta solicitud de mantenimiento."
                    : record.description}
                </Text>
              </Row>
            </GroupedList>
            <GroupedList header="Información sobre la petición">
              <Row
                title="Inicio de la solicitud"
                trailingType="chevron"
                showChevron={false}
                caption={formatDate(record.issued_datetime, "Iniciada el ")}
              />
              <Row
                title="vehículo al que se le solicitó"
                trailingType="chevron"
                caption={`${vehicle.brand} ${vehicle.sub_brand} (${vehicle.year})\n`.trim()}
                onPress={() =>
                  router.push(`/vehicles/${vehicle.id}/technical_sheet/`)
                }
              />
              <Row
                title="Quien solicitó"
                trailingType="chevron"
                onPress={() => {
                  router.push(`/users/${record.issued_by.id}/`);
                }}
                caption={`${record.issued_by.name} ${record.issued_by.father_last_name} ${record.issued_by.mother_last_name}`.trim()}
              />
            </GroupedList>

            {record.status === "SOLVED" && (
              <GroupedList header="Información sobre la resolución">
                <Row
                  title="Fecha de resolución"
                  trailingType="chevron"
                  showChevron={false}
                  caption={
                    record.resolved_datetime
                      ? formatDate(record.resolved_datetime, "Finalizada el ")
                      : "Aunque la solicitud ya fue resuelta, no se registró la fecha de resolución."
                  }
                />
                <Row
                  title="Quien resolvió"
                  trailingType="chevron"
                  onPress={() => {
                    record.resolved_by &&
                      router.push(`/users/${record.resolved_by.id}/`);
                  }}
                  showChevron={record.resolved_by ? true : false}
                  caption={
                    record.resolved_by
                      ? `${record.resolved_by.name} ${record.resolved_by.father_last_name} ${record.resolved_by.mother_last_name}`.trim()
                      : "Aunque la solicitud ya fue resuelta, no se registró quien la resolvió."
                  }
                />
              </GroupedList>
            )}

            <GroupedList header="Acciones para esta solicitud">
              <Row
                title="Cambiar el estatus de la solicitud"
                trailingType="chevron"
                icon={<RefreshCcw size={24} color="white" />}
                color={colorPalette.green[500]}
              />
              <Row
                title="Agregar comentario"
                trailingType="chevron"
                icon={<MessageCirclePlus size={24} color="white" />}
                color={colorPalette.neutral[500]}
              />
              <Row
                title="Eliminar solicitud"
                trailingType="chevron"
                icon={<Trash size={24} color="white" />}
                color={colorPalette.red[500]}
              />
            </GroupedList>
          </View>
        )}
        {currentTabIndex === 1 && (
          <>
            {maintenanceDocuments.length === 0 ? (
              <View style={{ marginTop: 36 }}>
                <EmptyScreen
                  caption="No se han adjuntado archivos a esta solicitud"
                  buttonCaption="Reintentar"
                  retryFunction={fetchMaintenanceDocuments}
                />
              </View>
            ) : (
              <View style={styles.groupedListsContainer}>
                {maintenanceDocuments.map((document) => (
                  <GroupedList
                    key={document.document_id}
                    header={`Creado ${formatDate(document.created_at, "el")}`}
                  >
                    <React.Fragment>
                      <Row
                        title={
                          document.title ? document.title : document.document_id
                        }
                        trailingType="chevron"
                        icon={<File size={24} color="white" />}
                        color={colorPalette.green[500]}
                        onPress={() =>
                          router.navigate(
                            `/vehicles/${document.vehicle_id}/maintenance/${document.maintenance_id}/${document.document_id}/`
                          )
                        }
                      />
                      <Row
                        trailingType="chevron"
                        showChevron={false}
                        title=""
                        disabled
                      >
                        <Text style={styles.haderDescription}>
                          {document.description
                            ? document.description
                            : "No se proveyó ninguna descripción para este documento."}
                        </Text>
                      </Row>
                    </React.Fragment>
                  </GroupedList>
                ))}
              </View>
            )}
          </>
        )}

        {currentTabIndex === 2 && (
          <View style={styles.groupedListsContainer}>
            <GroupedList>
              <Row
                title="Actualizaciones"
                trailingType="chevron"
                caption="No se registraron actualizaciones para esta solicitud"
                icon={<Info size={24} color="white" />}
                color={colorPalette.cyan[500]}
              />
            </GroupedList>
          </View>
        )}
      </ScrollView>
    </>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  segmentedControl: {
    width: "97%",
    margin: "auto",
    marginVertical: 6,
  },
  groupedListsContainer: {
    gap: theme.marginsComponents.section,
    marginTop: 6,
    marginBottom: 36,
  },
  haderDescription: {
    color: theme.textPresets.main,
    fontSize: 16,
  },
  headerTitle: {
    textAlign: "center",
    fontSize: 22,
    fontWeight: "bold",
    marginHorizontal: 12,
    marginVertical: 12,
    color: theme.textPresets.main,
  },
}));
