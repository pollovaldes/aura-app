import { ActionButton } from "@/components/actionButton/ActionButton";
import { ActionButtonGroup } from "@/components/actionButton/ActionButtonGroup";
import EmptyScreen from "@/components/dataStates/EmptyScreen";
import ErrorScreen from "@/components/dataStates/ErrorScreen";
import { FetchingIndicator } from "@/components/dataStates/FetchingIndicator";
import UnauthorizedScreen from "@/components/dataStates/UnauthorizedScreen";
import RowIcon from "@/components/grouped-list/RowIcon";
import { SimpleList } from "@/components/simpleList/SimpleList";
import { formatDate } from "@/features/global/functions/formatDate";
import { useRoutes } from "@/features/routePage/hooks/useRoutes";
import useProfile from "@/hooks/useProfile";
import { colorPalette } from "@/style/themes";
import { Stack, useLocalSearchParams } from "expo-router";
import { BedSingle, Ellipsis, Fuel, RotateCw, TriangleAlert, Wrench } from "lucide-react-native";
import React from "react";
import { useEffect, useState } from "react";
import { FlatList, Platform, Text } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

const statesConfig = {
  EMERGENCY: {
    text: "Emergnecia",
    backgroundColor: "#e8f5e9",
    textColor: "#2e7d32",
    icon: TriangleAlert,
    iconBackgroundColor: colorPalette.yellow[500],
  },
  FAILURE: {
    text: "Fallo",
    backgroundColor: "#fff3e0",
    textColor: "#ef6c00",
    icon: Wrench,
    iconBackgroundColor: colorPalette.cyan[500],
  },
  BREAK: {
    text: "Descanso",
    backgroundColor: "#fff3e0",
    textColor: "#ef6c00",
    icon: BedSingle,
    iconBackgroundColor: colorPalette.green[500],
  },
  REFUELING: {
    text: "Combustible",
    backgroundColor: "#fff3e0",
    textColor: "#ef6c00",
    icon: Fuel,
    iconBackgroundColor: colorPalette.red[500],
  },
  OTHER: {
    text: "Otro",
    backgroundColor: "#fff3e0",
    textColor: "#ef6c00",
    icon: Ellipsis,
    iconBackgroundColor: colorPalette.neutral[500],
  },
};

export function VehicleRouteStopsList() {
  const { styles } = useStyles(stylesheet);
  const { getGuaranteedProfile } = useProfile();
  const profile = getGuaranteedProfile();
  const { vehicleId, routeId } = useLocalSearchParams<{ vehicleId: string; routeId: string }>();
  const { routes, fetchRouteById, refetchRouteById, error } = useRoutes(vehicleId);
  const [routeIsLoading, setRouteIsLoading] = useState(false);
  const route = routes[routeId];

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
        <Stack.Screen
          options={{
            title: "Recurso inaccesible",
            headerLargeTitle: false,
            headerRight: undefined,
          }}
        />
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
          title: "Paradas",
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

      <FlatList
        contentInsetAdjustmentBehavior="automatic"
        data={route.route_events}
        keyExtractor={(item) => item.id}
        onRefresh={refetchRoute}
        refreshing={routeIsLoading}
        renderItem={({ item }) => (
          <SimpleList
            relativeToDirectory
            href={`./${item.id}`}
            leading={
              <RowIcon
                icon={statesConfig[item.event_type].icon}
                backgroundColor={statesConfig[item.event_type].iconBackgroundColor}
              />
            }
            content={
              <>
                <Text style={styles.itemTitle}>{`${statesConfig[item.event_type].text}`}</Text>
                <Text style={styles.itemDetails}>{`${formatDate(item.started_at, "Iniciado el ")}`}</Text>
              </>
            }
          />
        )}
        ListEmptyComponent={<EmptyScreen caption="No hay rutas para este vehículo" />}
      />
    </>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  itemTitle: {
    fontWeight: "bold",
    fontSize: 18,
    color: theme.textPresets.main,
  },
  itemDescription: {
    fontSize: 18,
    color: theme.textPresets.main,
  },
  itemDetails: {
    fontSize: 16,
    color: theme.textPresets.subtitle,
  },
}));
