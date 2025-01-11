import React, { useEffect, useState } from "react";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useRoutes } from "@/features/routePage/hooks/useRoutes";
import { FetchingIndicator } from "@/components/dataStates/FetchingIndicator";
import UnauthorizedScreen from "@/components/dataStates/UnauthorizedScreen";
import { Platform, RefreshControl, ScrollView, Text, View } from "react-native";
import Row from "@/components/grouped-list/Row";
import { useElapsedTime } from "@/features/global/hooks/useElapsedTime";
import GroupedList from "@/components/grouped-list/GroupedList";
import { CircleHelp, Info, Locate, MapPin, Maximize2, Minimize2, RotateCw } from "lucide-react-native";
import { colorPalette } from "@/style/themes";
import StatusChip from "@/components/General/StatusChip";
import { formatDate } from "@/features/global/functions/formatDate";
import { ActionButtonGroup } from "@/components/actionButton/ActionButtonGroup";
import { ActionButton } from "@/components/actionButton/ActionButton";
import { UniversalMap as UniversalMapNative } from "@/features/global/components/UniversalMap.native";
import { UniversalMap as UniversalMapWeb } from "@/features/global/components/UniversalMap.web";
import ErrorScreen from "@/components/dataStates/ErrorScreen";

const statesConfig = {
  true: {
    text: "En curso",
    backgroundColor: "#e8f5e9",
    textColor: "#2e7d32",
  },
  false: {
    text: "Finalizada",
    backgroundColor: "#fff3e0",
    textColor: "#ef6c00",
  },
};

export function VehicleRouteDetails() {
  const { styles } = useStyles(stylesheet);
  const { vehicleId, routeId } = useLocalSearchParams<{ vehicleId: string; routeId: string }>();
  const { routes, fetchRouteById, refetchRouteById, error } = useRoutes(vehicleId);
  const route = routes[routeId];
  const [routeIsLoading, setRouteIsLoading] = useState(false);
  const elapsedTime = useElapsedTime(route?.started_at);
  const [refocusTrigger, setRefocusTrigger] = useState(0);
  const [isMaximized, setIsMaximized] = useState(false);

  function handleRefocus() {
    setRefocusTrigger((prev) => prev + 1);
  }

  function handleMaximize() {
    setIsMaximized((prev) => !prev);
  }

  async function fetchRoute() {
    setRouteIsLoading(true);
    await fetchRouteById(routeId);
    setRouteIsLoading(false);
  }

  async function refetchRoute() {
    setRouteIsLoading(true);
    await refetchRouteById(routeId);
    setRouteIsLoading(false);
  }

  useEffect(() => {
    fetchRoute();
  }, []);

  if (error) {
    return (
      <ErrorScreen
        caption="No se pudo carga la ruta"
        buttonCaption="Reintentar"
        retryFunction={async () => {
          await refetchRoute();
        }}
      />
    );
  }

  if (routeIsLoading) {
    return <FetchingIndicator caption="Cargando ruta" />;
  }

  if (!route) {
    return (
      <>
        <Stack.Screen options={{ title: "Recurso inaccesible", headerLargeTitle: false }} />
        <UnauthorizedScreen
          caption="No tienes acceso a este recurso."
          buttonCaption="Reintentar"
          retryFunction={refetchRoute}
        />
      </>
    );
  }

  if (route.vehicle_id !== vehicleId) {
    return (
      <UnauthorizedScreen
        caption="No tienes acceso a este recurso"
        buttonCaption="Reintentar"
        retryFunction={() => {}} //Leave blank
      />
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "Detalles de la ruta",
          headerLargeTitle: false,
          headerRight: () => (
            <ActionButtonGroup>
              <ActionButton
                onPress={() => {
                  refetchRoute();
                }}
                Icon={RotateCw}
                text="Actualizar"
                show={Platform.OS === "web"}
              />
            </ActionButtonGroup>
          ),
        }}
      />

      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        refreshControl={<RefreshControl refreshing={routeIsLoading} onRefresh={refetchRoute} />}
      >
        <View style={styles.section}>
          <View style={styles.group}>
            <GroupedList>
              <Row>
                <View style={styles.counterContainer}>
                  <Text style={styles.counterText}>{elapsedTime}</Text>
                </View>
              </Row>
            </GroupedList>
          </View>
          <View style={styles.group}>
            <GroupedList>
              <Row
                title="Asunto de la ruta"
                icon={Info}
                backgroundColor={colorPalette.cyan[500]}
                hideChevron
                caption={route.title}
              />
              <Row>
                <Text style={styles.routeDescription}>
                  {route.description || "No se proveyó ninguna descripción para esta ruta."}
                </Text>
              </Row>
            </GroupedList>
            <GroupedList>
              <Row
                title="Estatus de la ruta"
                icon={CircleHelp}
                backgroundColor={colorPalette.orange[500]}
                trailing={<StatusChip status={String(route.is_active)} statesConfig={statesConfig} />}
              />
              <Row
                title="Paradas"
                icon={MapPin}
                backgroundColor={colorPalette.red[500]}
                onPress={() => router.push(`./stops`, { relativeToDirectory: true })}
              />
            </GroupedList>
          </View>
          <View style={styles.group}>
            <GroupedList>
              <Row
                title="Quien hizo la ruta"
                caption={`${route.profiles?.name} ${route.profiles?.father_last_name} ${route.profiles?.mother_last_name}`}
                onPress={() => {
                  router.push(`/tab/user_details/${route.profiles?.id}`);
                }}
              />
              <Row
                title="Vehículo"
                caption={`${route.vehicles?.brand} ${route.vehicles?.sub_brand} (${route.vehicles?.year})`}
                onPress={() => router.push(`/tab/vehicle_details/${route.vehicles?.id}`)}
              />
            </GroupedList>
          </View>
          <View style={styles.group}>
            <GroupedList header="Comienzo de la ruta">
              <Row title="Inicio de la ruta" caption={formatDate(route.started_at, "Iniciada el ")} hideChevron />
              <Row title="Dirección de inicio" caption={route.started_address} hideChevron />
              <Row
                title="Ubicación"
                hideChevron
                trailing={
                  <ActionButtonGroup>
                    <ActionButton text="Centrar" Icon={Locate} onPress={handleRefocus} />
                    <ActionButton
                      text={isMaximized ? "Minimizar" : "Maximizar"}
                      Icon={isMaximized ? Minimize2 : Maximize2}
                      onPress={handleMaximize}
                    />
                  </ActionButtonGroup>
                }
              />
              <Row>
                {Platform.OS !== "web" ? (
                  <UniversalMapNative
                    latitude={route.started_location_latitude}
                    longitude={route.started_location_longitude}
                    refocusTrigger={refocusTrigger}
                    isMaximized={isMaximized}
                  />
                ) : (
                  <UniversalMapWeb
                    latitude={route.started_location_latitude}
                    longitude={route.started_location_longitude}
                    refocusTrigger={refocusTrigger}
                    isMaximized={isMaximized}
                  />
                )}
              </Row>
            </GroupedList>
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  section: {
    gap: theme.marginsComponents.section,
    marginTop: theme.marginsComponents.section,
    marginBottom: theme.marginsComponents.section,
  },
  group: {
    gap: theme.marginsComponents.group,
  },
  routeDescription: {
    color: theme.textPresets.main,
    fontSize: 16,
  },
  counterContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  counterText: {
    color: theme.textPresets.main,
    fontFamily: "SpaceMono",
    fontSize: 27,
  },
  mapContainer: {
    borderRadius: 10,
    width: "100%",
    maxWidth: 500,
    justifyContent: "center",
    alignItems: "center",
    transition: "height 0.3s ease",
  },
  map: {
    flex: 1,
    alignSelf: "stretch",
  },
}));
