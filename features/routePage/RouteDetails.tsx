import { router, Stack } from "expo-router";
import React, { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { FormButton } from "@/components/Form/FormButton";
import { BedSingle, Ellipsis, Fuel, History, Info, TriangleAlert, Wrench } from "lucide-react-native";
import GroupedList from "@/components/grouped-list/GroupedList";
import Row from "@/components/grouped-list/Row";
import { colorPalette } from "@/style/themes";
import { useElapsedTime } from "../global/hooks/useElapsedTime";
import { FetchingIndicator } from "@/components/dataStates/FetchingIndicator";
import ErrorScreen from "@/components/dataStates/ErrorScreen";
import { useActiveRoute } from "./hooks/useActiveRoute";
import useProfile from "@/hooks/useProfile";
import { ConfirmDialog } from "@/components/alert/ConfirmDialog";

export function RouteDetails() {
  const { styles } = useStyles(stylesheet);
  const { getGuaranteedProfile } = useProfile();
  const profile = getGuaranteedProfile();
  const { getElapsedTimeSince, getStaticValues } = useElapsedTime();
  const { activeRoute, activeRouteIsLoading, endRoute } = useActiveRoute(profile.id);
  const [endingRoute, setEndingRoute] = useState(false);

  const endRouteDialog = ConfirmDialog({
    title: "Confirmación",
    message: `¿Estás seguro de que quieres finalizar la ruta?`,
    cancelText: "Cancelar",
    confirmText: "Finalizar",
    confirmStyle: "destructive",
    onConfirm: async () => {
      setEndingRoute(true);
      await endRoute(activeRoute!.id);
      setEndingRoute(false);
    },
    onCancel: () => {},
  });

  if (activeRouteIsLoading) {
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

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Ruta en curso",
        }}
      />

      <View style={styles.container}>
        <ScrollView>
          <View style={styles.section}>
            <Text style={styles.timer}>{getElapsedTimeSince(activeRoute.started_at)}</Text>
            <GroupedList>
              <Row title="Información de la ruta" icon={Info} backgroundColor={colorPalette.cyan[500]} />
              <Row title="Historial de paradas" icon={History} backgroundColor={colorPalette.green[500]} />
            </GroupedList>
            <GroupedList header="Paradas">
              <Row title="Registrar combustible" icon={Fuel} backgroundColor={colorPalette.neutral[500]} />
              <Row title="Registrar descanso" icon={BedSingle} backgroundColor={colorPalette.neutral[500]} />
              <Row title="Registrar falla" icon={Wrench} backgroundColor={colorPalette.neutral[500]} />
              <Row title="Registrar otro" icon={Ellipsis} backgroundColor={colorPalette.neutral[500]} />
              <Row title="Registrar emergencia" icon={TriangleAlert} backgroundColor={colorPalette.red[500]} />
            </GroupedList>
            <View style={[styles.group, { paddingHorizontal: 12 }]}>
              <FormButton
                title="Finalizar ruta"
                onPress={() => endRouteDialog.showDialog()}
                buttonType="danger"
                isLoading={endingRoute}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </>
  );
}

const stylesheet = createStyleSheet((theme, runtime) => ({
  container: {
    flex: 1,
  },
  timer: {
    color: theme.textPresets.main,
    fontSize: 45,
    textAlign: "center",
    paddingTop: 25,
    fontFamily: "SpaceMono",
  },
  section: {
    gap: theme.marginsComponents.section,
  },
  group: {
    gap: theme.marginsComponents.group,
  },
}));
