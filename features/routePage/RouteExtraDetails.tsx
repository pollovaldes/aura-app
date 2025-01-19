import useProfile from "@/hooks/useProfile";
import { Platform, RefreshControl, ScrollView, Text } from "react-native";
import { useElapsedTime } from "../global/hooks/useElapsedTime";
import { useActiveRoute } from "./hooks/useActiveRoute";
import { useState } from "react";
import { FetchingIndicator } from "@/components/dataStates/FetchingIndicator";
import ErrorScreen from "@/components/dataStates/ErrorScreen";
import { router, Stack } from "expo-router";
import { Route } from "@/types/globalTypes";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { View } from "react-native";
import GroupedList from "@/components/grouped-list/GroupedList";
import Row from "@/components/grouped-list/Row";
import { ActionButtonGroup } from "@/components/actionButton/ActionButtonGroup";
import { ActionButton } from "@/components/actionButton/ActionButton";
import { CircleHelp, Info, Locate, MapPin, Maximize2, Minimize2, RotateCw } from "lucide-react-native";
import React from "react";
import { colorPalette } from "@/style/themes";
import StatusChip from "@/components/General/StatusChip";
import { formatDate } from "../global/functions/formatDate";
import { UniversalMap as UniversalMapNative } from "@/features/global/components/UniversalMap.native";
import { UniversalMap as UniversalMapWeb } from "@/features/global/components/UniversalMap.web";

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

export function RouteExtraDetails() {
  const { getGuaranteedProfile } = useProfile();
  const profile = getGuaranteedProfile();
  const { getElapsedTimeSince } = useElapsedTime();
  const { activeRoute, activeRouteIsLoading, fetchActiveRouteIdStandalone } = useActiveRoute(profile.id);
  const [activeRouteIsRefreshing, setActiveRouteIsRefreshing] = useState(false);
  const { styles } = useStyles(stylesheet);
  const [refocusTrigger, setRefocusTrigger] = useState(0);
  const [isMaximized, setIsMaximized] = useState(false);

  function handleRefocus() {
    setRefocusTrigger((prev) => prev + 1);
  }

  function handleMaximize() {
    setIsMaximized((prev) => !prev);
  }

  if (activeRouteIsLoading || activeRouteIsRefreshing) {
    return <FetchingIndicator caption="Obteniendo información de la ruta activa" />;
  }

  if (!activeRoute) {
    return (
      <ErrorScreen
        caption="No hay una ruta activa, sal de esta pantalla"
        buttonCaption="Volver a inicio"
        retryFunction={() => router.replace("/")}
      />
    );
  }

  async function refetchActiveRoute(activeRoute: Route) {
    setActiveRouteIsRefreshing(true);
    await fetchActiveRouteIdStandalone(activeRoute.id);
    setActiveRouteIsRefreshing(false);
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "Información de la ruta",
          headerLargeTitle: false,
          headerRight: () => (
            <ActionButtonGroup>
              <ActionButton
                onPress={() => {
                  refetchActiveRoute(activeRoute);
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
        refreshControl={
          <RefreshControl refreshing={activeRouteIsRefreshing} onRefresh={() => refetchActiveRoute(activeRoute)} />
        }
      >
        <View style={styles.section}>
          <View style={styles.group}>
            <GroupedList>
              <Row>
                <View style={styles.counterContainer}>
                  <View style={styles.group}>
                    <Text style={styles.routeHeaderActive}>Ruta en curso</Text>
                  </View>
                  <View style={[styles.group, { alignItems: "center" }]}>
                    <Text style={styles.counterTextActive}>{getElapsedTimeSince(activeRoute.started_at)}</Text>
                    <Text style={styles.routeDescription}>Tiempo transcurrido</Text>
                  </View>
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
                caption={activeRoute.title}
              />
              <Row>
                <Text style={styles.routeDescription}>
                  {activeRoute.description || "No se proveyó ninguna descripción para esta ruta."}
                </Text>
              </Row>
            </GroupedList>
            <GroupedList>
              <Row
                title="Estatus de la ruta"
                icon={CircleHelp}
                backgroundColor={colorPalette.orange[500]}
                trailing={<StatusChip status={String(activeRoute.is_active)} statesConfig={statesConfig} />}
              />
            </GroupedList>
          </View>

          <View style={styles.group}>
            <GroupedList>
              <Row
                title="Quien hizo la ruta"
                caption={`${activeRoute.profiles?.name} ${activeRoute.profiles?.father_last_name} ${activeRoute.profiles?.mother_last_name}`}
                onPress={() => {
                  router.push(`/tab/user_details/${activeRoute.profiles?.id}`);
                }}
              />
              <Row
                title="Vehículo"
                caption={`${activeRoute.vehicles?.brand} ${activeRoute.vehicles?.sub_brand} (${activeRoute.vehicles?.year})`}
                onPress={() => router.push(`/tab/vehicle_details/${activeRoute.vehicles?.id}`)}
              />
            </GroupedList>
          </View>

          <View style={styles.group}>
            <GroupedList header="Comienzo de la ruta">
              <Row title="Inicio de la ruta" caption={formatDate(activeRoute.started_at, "Iniciada el ")} hideChevron />
              <Row title="Dirección de inicio" caption={activeRoute.started_address} hideChevron />
              <Row
                title="Ubicación de inicio"
                hideChevron
                trailing={
                  <ActionButtonGroup>
                    <ActionButton text="Centrar" Icon={Locate} onPress={() => handleRefocus()} />
                    <ActionButton
                      text={isMaximized ? "Minimizar" : "Maximizar"}
                      Icon={isMaximized ? Minimize2 : Maximize2}
                      onPress={() => handleMaximize()}
                    />
                  </ActionButtonGroup>
                }
              />
              <Row>
                {Platform.OS !== "web" ? (
                  <UniversalMapNative
                    latitude={activeRoute.started_location_latitude}
                    longitude={activeRoute.started_location_longitude}
                    refocusTrigger={refocusTrigger}
                    isMaximized={isMaximized}
                  />
                ) : (
                  <UniversalMapWeb
                    latitude={activeRoute.started_location_latitude}
                    longitude={activeRoute.started_location_longitude}
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
  routeHeaderActive: {
    fontSize: 30,
    fontWeight: "bold",
    color: theme.textPresets.main,
  },
  routeHeaderInactive: {
    fontSize: 30,
    fontWeight: "bold",
    color: theme.textPresets.subtitle,
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
    width: "100%",
  },
  counterTextActive: {
    color: theme.textPresets.main,
    fontFamily: "SpaceMono",
    fontSize: 41,
  },
  counterTextInactive: {
    color: theme.textPresets.subtitle,
    fontFamily: "SpaceMono",
    fontSize: 41,
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
