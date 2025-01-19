import ErrorScreen from "@/components/dataStates/ErrorScreen";
import { FetchingIndicator } from "@/components/dataStates/FetchingIndicator";
import useProfile from "@/hooks/useProfile";
import { FlatList, Platform, Text } from "react-native";
import { useActiveRoute } from "./hooks/useActiveRoute";
import { useState } from "react";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import React from "react";
import { router, Stack } from "expo-router";
import { ActionButtonGroup } from "@/components/actionButton/ActionButtonGroup";
import { ActionButton } from "@/components/actionButton/ActionButton";
import { BedSingle, Ellipsis, Fuel, RotateCw, TriangleAlert, Wrench } from "lucide-react-native";
import { Route } from "@/types/globalTypes";
import { SimpleList } from "@/components/simpleList/SimpleList";
import RowIcon from "@/components/grouped-list/RowIcon";
import { colorPalette } from "@/style/themes";
import { formatDate } from "../global/functions/formatDate";
import EmptyScreen from "@/components/dataStates/EmptyScreen";

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
    icon: Wrench,
    textColor: "#ef6c00",
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

export function RouteStops() {
  const { getGuaranteedProfile } = useProfile();
  const profile = getGuaranteedProfile();
  const { activeRoute, activeRouteIsLoading, fetchActiveRouteIdStandalone } = useActiveRoute(profile.id);
  const [activeRouteIsRefreshing, setActiveRouteIsRefreshing] = useState(false);
  const { styles } = useStyles(stylesheet);

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
          title: "Paradas",
          headerLargeTitle: false,
          headerRight: () => (
            <ActionButtonGroup>
              <ActionButton
                onPress={() => refetchActiveRoute(activeRoute)}
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
        data={activeRoute.route_events}
        keyExtractor={(item) => item.id}
        onRefresh={() => refetchActiveRoute(activeRoute)}
        refreshing={activeRouteIsRefreshing}
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
        ListEmptyComponent={<EmptyScreen caption="Aún no hay paradas" />}
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
