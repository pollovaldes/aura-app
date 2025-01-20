import { router, Stack } from "expo-router";
import React, { useState } from "react";
import { Platform, RefreshControl, ScrollView, Text, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { FormButton } from "@/components/Form/FormButton";
import { BedSingle, Ellipsis, Fuel, History, Info, Pencil, RotateCw, TriangleAlert, Wrench } from "lucide-react-native";
import GroupedList from "@/components/grouped-list/GroupedList";
import Row from "@/components/grouped-list/Row";
import { colorPalette } from "@/style/themes";
import { useElapsedTime } from "../global/hooks/useElapsedTime";
import { FetchingIndicator } from "@/components/dataStates/FetchingIndicator";
import ErrorScreen from "@/components/dataStates/ErrorScreen";
import { useActiveRoute } from "./hooks/useActiveRoute";
import useProfile from "@/hooks/useProfile";
import { ConfirmDialog } from "@/components/alert/ConfirmDialog";
import Modal from "@/components/Modal/Modal";
import { EndRouteModal } from "../tabs/vehicles/modals/EndRouteModal";
import * as Location from "expo-location";
import { ActionButtonGroup } from "@/components/actionButton/ActionButtonGroup";
import { ActionButton } from "@/components/actionButton/ActionButton";
import { Route } from "@/types/globalTypes";
import { FuelModal } from "./stopModals/FuelModal";
import { useCurrentStop } from "./hooks/useCurrentStop";

type ModalType = "end_route" | "fuel" | "break" | "failure" | "other" | "emergency" | null;

export function RouteDetails() {
  const { styles } = useStyles(stylesheet);
  const { getGuaranteedProfile } = useProfile();
  const profile = getGuaranteedProfile();
  const { getElapsedTimeSince } = useElapsedTime();
  const { activeRoute, activeRouteIsLoading, fetchActiveRouteIdStandalone } = useActiveRoute(profile.id);
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const closeModal = () => setActiveModal(null);
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [activeRouteIsRefreshing, setActiveRouteIsRefreshing] = useState(false);
  const { currentStop, currentStopIsLoading, saveCurrentStop } = useCurrentStop();

  async function locationPermission() {
    setIsLocationLoading(true);

    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("No tenemos permiso para acceder a tu ubicación.");
      setIsLocationLoading(false);
      return false;
    }

    setIsLocationLoading(false);
    return true;
  }

  const endRouteDialog = ConfirmDialog({
    title: "Confirmación",
    message: `¿Estás seguro de que quieres finalizar la ruta?`,
    cancelText: "Cancelar",
    confirmText: "Finalizar",
    confirmStyle: "destructive",
    onConfirm: async () => {
      if (await locationPermission()) {
        setActiveModal("end_route");
      }
      return;
    },
    onCancel: () => {},
  });

  const registerStop = ConfirmDialog({
    title: "Confirmación",
    message: `¿Estás seguro de que quieres registrar una parada?`,
    cancelText: "Cancelar",
    confirmText: "Iniciar parada",
    confirmStyle: "default",
    onConfirm: () => {
      setActiveModal("end_route");
      return;
    },
    onCancel: () => {},
  });

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

  function openLatestStop() {
    if (!currentStop) {
      console.log("No hay una parada actual");
      return;
    }

    if (!currentStop.event_type) {
      console.log("No está definido el tipo de parada");
      return;
    }

    switch (currentStop.event_type) {
      case "REFUELING":
        setActiveModal("fuel");
        break;
      case "BREAK":
        setActiveModal("break");
        break;
      case "FAILURE":
        setActiveModal("failure");
        break;
      case "OTHER":
        setActiveModal("other");
        break;
      case "EMERGENCY":
        setActiveModal("emergency");
    }
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Ruta en curso",
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

      <Modal close={closeModal} isOpen={activeModal === "end_route"}>
        <EndRouteModal close={closeModal} activeRoute={activeRoute} />
      </Modal>

      <Modal close={closeModal} isOpen={activeModal === "fuel"}>
        <FuelModal close={closeModal} />
      </Modal>

      <Modal close={closeModal} isOpen={activeModal === "break"}>
        <></>
      </Modal>

      <Modal close={closeModal} isOpen={activeModal === "failure"}>
        <></>
      </Modal>

      <Modal close={closeModal} isOpen={activeModal === "other"}>
        <></>
      </Modal>

      <Modal close={closeModal} isOpen={activeModal === "emergency"}>
        <></>
      </Modal>

      <View style={styles.container}>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={activeRouteIsRefreshing} onRefresh={() => refetchActiveRoute(activeRoute)} />
          }
        >
          <View style={styles.section}>
            <Text style={styles.timer}>{getElapsedTimeSince(activeRoute.started_at)}</Text>
            <GroupedList>
              <Row
                title="Información de la ruta"
                icon={Info}
                backgroundColor={colorPalette.cyan[500]}
                onPress={() => router.push("./details", { relativeToDirectory: true })}
              />
              <Row
                title="Historial de paradas"
                icon={History}
                backgroundColor={colorPalette.green[500]}
                onPress={() => router.push("./stops", { relativeToDirectory: true })}
              />
            </GroupedList>
            {currentStop && (
              <GroupedList header="Finalizar registro de parada">
                <Row
                  title="Continuar editando parada"
                  icon={Pencil}
                  backgroundColor={colorPalette.yellow[500]}
                  onPress={openLatestStop}
                />
              </GroupedList>
            )}

            <GroupedList header="Paradas">
              <Row
                title="Registrar combustible"
                icon={Fuel}
                backgroundColor={colorPalette.neutral[500]}
                onPress={() => setActiveModal("fuel")}
                disabled={currentStop !== null}
              />
              <Row
                title="Registrar descanso"
                icon={BedSingle}
                backgroundColor={colorPalette.neutral[500]}
                disabled={currentStop !== null}
              />
              <Row
                title="Registrar falla"
                icon={Wrench}
                backgroundColor={colorPalette.neutral[500]}
                disabled={currentStop !== null}
              />
              <Row
                title="Registrar otro"
                icon={Ellipsis}
                backgroundColor={colorPalette.neutral[500]}
                disabled={currentStop !== null}
              />
              <Row
                title="Registrar emergencia"
                icon={TriangleAlert}
                backgroundColor={colorPalette.red[500]}
                disabled={currentStop !== null}
              />
            </GroupedList>
            <View style={[styles.group, { paddingHorizontal: 12 }]}>
              <FormButton
                title="Finalizar ruta"
                onPress={() => endRouteDialog.showDialog()}
                buttonType="danger"
                isLoading={isLocationLoading}
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
