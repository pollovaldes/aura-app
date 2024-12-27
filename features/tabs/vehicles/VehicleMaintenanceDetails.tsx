import ErrorScreen from "@/components/dataStates/ErrorScreen";
import UnauthorizedScreen from "@/components/dataStates/UnauthorizedScreen";
import GroupedList from "@/components/grouped-list/GroupedList";
import Row from "@/components/grouped-list/Row";
import useMaintenance from "@/hooks/useMaintenance";
import useProfile from "@/hooks/useProfile";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { router, Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, RefreshControl, ScrollView, Text, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { colorPalette } from "@/style/themes";
import { CircleHelp, Info, MessageCirclePlus, RefreshCcw, Trash } from "lucide-react-native";
import StatusChip from "@/components/General/StatusChip";
import useMaintenanceDocuments from "@/hooks/useMaintenanceDocuments";
import EmptyScreen from "@/components/dataStates/EmptyScreen";
import { FetchingIndicator } from "@/components/dataStates/FetchingIndicator";
import { SimpleList } from "@/components/simpleList/SimpleList";
import { useVehicle } from "@/hooks/truckHooks/useVehicle";

export default function VehicleMaintenanceDetails() {
  const { styles } = useStyles(stylesheet);
  const { getGuaranteedProfile } = useProfile();
  const { vehicles, fetchVehicleById, refetchVehicleById } = useVehicle();
  const profile = getGuaranteedProfile();
  const { maintenanceId } = useLocalSearchParams<{ maintenanceId: string }>();
  const { vehicleId } = useLocalSearchParams<{ vehicleId: string }>();
  const { maintenanceRecords, areMaintenanceRecordsLoading, fetchMaintenance } = useMaintenance(
    undefined,
    maintenanceId
  );
  const { areMaintenanceDocumentsLoading, fetchMaintenanceDocuments, maintenanceDocuments } =
    useMaintenanceDocuments(maintenanceId);
  const [currentTabIndex, setCurrentTabIndex] = useState(0);
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

  if (vehicleIsLoading || areMaintenanceRecordsLoading || areMaintenanceDocumentsLoading) {
    return (
      <FetchingIndicator
        caption={
          vehicleIsLoading
            ? "Cargando vehículo"
            : areMaintenanceRecordsLoading
              ? "Cargando solicitudes de mantenimiento"
              : "Cargando documentos"
        }
      />
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
      <UnauthorizedScreen
        caption={`Ocurrió un error y no pudimos \ncargar las solicitudes de mantenimiento`}
        buttonCaption="Reintentar"
        retryFunction={fetchMaintenance}
      />
    );
  }

  if (!maintenanceDocuments) {
    return (
      <ErrorScreen
        caption={`Ocurrió un error y no pudimos \ncargar los documentos`}
        buttonCaption="Reintentar"
        retryFunction={fetchMaintenanceDocuments}
      />
    );
  }

  console.log("maintennaceDocs" + maintenanceDocuments);

  const record = maintenanceRecords[0];

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
          retryFunction={refetchVehicle}
        />
      </>
    );
  }

  const canEdit = profile.role === "ADMIN" || profile.role === "OWNER" || profile.role === "DRIVER";

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

  function formatDate(dateString: string, prefix: string) {
    const date = new Date(dateString);

    const day = date.getDate();
    const month = date.toLocaleString("es", { month: "long" });
    const year = date.getFullYear();

    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

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
      {currentTabIndex === 0 ? (
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          refreshControl={
            <RefreshControl
              refreshing={vehicleIsLoading || areMaintenanceRecordsLoading || areMaintenanceDocumentsLoading}
              onRefresh={() => {
                refetchVehicle();
                fetchMaintenance();
                fetchMaintenanceDocuments();
              }}
            />
          }
          style={{ flex: 1 }}
        >
          <SegmentedControl
            values={["General", "Archivos y medios"]}
            selectedIndex={currentTabIndex}
            onChange={(event) => setCurrentTabIndex(event.nativeEvent.selectedSegmentIndex)}
            style={styles.segmentedControl}
          />
          <View style={styles.groupedListsContainer}>
            <GroupedList>
              <Row
                title="Estatus de la solicitud"
                trailing={<StatusChip status={record.status} statesConfig={statesConfig} />}
                icon={CircleHelp}
                backgroundColor={colorPalette.orange[500]}
              />
              <Row
                title="Descripción general"
                caption={record.title}
                icon={Info}
                backgroundColor={colorPalette.cyan[500]}
                hideChevron
              />
              <Row>
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
                caption={formatDate(record.issued_datetime, "Iniciada el ")}
                hideChevron
              />
              <Row
                title="Vehículo al que se le solicitó"
                caption={`${vehicle.brand} ${vehicle.sub_brand} (${vehicle.year})\n`.trim()}
                onPress={() => router.push(`/tab/vehicle_details/${vehicle.id}`)}
              />
              <Row
                title="Quien solicitó"
                onPress={() => {
                  router.push(`/tab/user_details/${record.issued_by.id}`);
                }}
                caption={`${record.issued_by.name} ${record.issued_by.father_last_name} ${record.issued_by.mother_last_name}`.trim()}
              />
            </GroupedList>

            {record.status === "SOLVED" && (
              <GroupedList header="Información sobre la resolución">
                <Row
                  title="Fecha de resolución"
                  hideChevron
                  caption={
                    record.resolved_datetime
                      ? formatDate(record.resolved_datetime, "Finalizada el ")
                      : "Aunque la solicitud ya fue resuelta, no se registró la fecha de resolución."
                  }
                />
                <Row
                  title="Quien resolvió"
                  onPress={() => {
                    record.resolved_by && router.push(`/tab/user_details/${record.resolved_by.id}`);
                  }}
                  hideChevron={record.resolved_by ? false : true}
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
                icon={RefreshCcw}
                backgroundColor={colorPalette.green[500]}
              />
              <Row title="Agregar comentario" icon={MessageCirclePlus} backgroundColor={colorPalette.neutral[500]} />
              <Row title="Eliminar solicitud" icon={Trash} backgroundColor={colorPalette.red[500]} />
            </GroupedList>
          </View>
        </ScrollView>
      ) : (
        <FlatList
          refreshing={vehicleIsLoading}
          onRefresh={refetchVehicle}
          contentInsetAdjustmentBehavior="automatic"
          data={maintenanceDocuments}
          keyExtractor={(item) => item.document_id}
          ListHeaderComponent={
            <SegmentedControl
              values={["General", "Archivos y medios"]}
              selectedIndex={currentTabIndex}
              onChange={(event) => setCurrentTabIndex(event.nativeEvent.selectedSegmentIndex)}
              style={styles.segmentedControl}
            />
          }
          renderItem={({ item }) => (
            <SimpleList
              relativeToDirectory
              href={`./${item.document_id}`}
              content={
                <View style={{ flexDirection: "column" }}>
                  <Text style={styles.itemTitle}>{item.title ? item.title : "No se proveyó ningún título."}</Text>
                  <Text style={styles.itemSubtitle}>{formatDate(item.created_at, "Creado el ")}</Text>
                  <Text style={styles.itemSubtitle}>
                    {item.description ? item.description : "No se proveyó ninguna descripción."}
                  </Text>
                </View>
              }
            />
          )}
          ListEmptyComponent={<EmptyScreen caption="No hay documentos para este vehículo." />}
        />
      )}
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
