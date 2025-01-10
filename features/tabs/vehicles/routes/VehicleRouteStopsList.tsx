import { ActionButton } from "@/components/actionButton/ActionButton";
import { ActionButtonGroup } from "@/components/actionButton/ActionButtonGroup";
import EmptyScreen from "@/components/dataStates/EmptyScreen";
import { FetchingIndicator } from "@/components/dataStates/FetchingIndicator";
import UnauthorizedScreen from "@/components/dataStates/UnauthorizedScreen";
import { SimpleList } from "@/components/simpleList/SimpleList";
import { useRoutes } from "@/features/routePage/hooks/useRoutes";
import useProfile from "@/hooks/useProfile";
import { Stack, useLocalSearchParams } from "expo-router";
import { RotateCw } from "lucide-react-native";
import React from "react";
import { useEffect, useState } from "react";
import { FlatList, Platform, RefreshControl, ScrollView, Text, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

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

export function VehicleRouteStopsList() {
  const { styles } = useStyles(stylesheet);
  const { getGuaranteedProfile } = useProfile();
  const profile = getGuaranteedProfile();
  const { vehicleId, routeId } = useLocalSearchParams<{ vehicleId: string; routeId: string }>();
  const { routes, fetchRouteById, refetchRouteById } = useRoutes(vehicleId);
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
            content={
              <>
                <Text style={styles.itemTitle}>{`${item.event_type}`}</Text>
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
