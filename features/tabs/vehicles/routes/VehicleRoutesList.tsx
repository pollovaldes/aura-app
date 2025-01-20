import { ActionButton } from "@/components/actionButton/ActionButton";
import { ActionButtonGroup } from "@/components/actionButton/ActionButtonGroup";
import Modal from "@/components/Modal/Modal";
import { Stack, useLocalSearchParams } from "expo-router";
import { Download, FilterIcon, FilterX, Plus, RotateCw } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Platform, Text, View } from "react-native";
import { AddRouteModal } from "../modals/addRouteModal/AddRouteModal";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { useRoutes } from "@/features/routePage/hooks/useRoutes";
import { FetchingIndicator } from "@/components/dataStates/FetchingIndicator";
import ErrorScreen from "@/components/dataStates/ErrorScreen";
import { SimpleList } from "@/components/simpleList/SimpleList";
import EmptyScreen from "@/components/dataStates/EmptyScreen";
import { formatDate } from "@/features/global/functions/formatDate";
import useProfile from "@/hooks/useProfile";
import StatusChip from "@/components/General/StatusChip";
import { useElapsedTime } from "@/features/global/hooks/useElapsedTime";
import { useActiveRoute } from "@/features/routePage/hooks/useActiveRoute";
import { RoutesListFilterModal } from "./RoutesListFilterModal";
import * as Location from "expo-location";
import Toast from "react-native-toast-message";

const showToast = (title: string, caption: string) => {
  Toast.show({
    type: "alert",
    text1: title,
    text2: caption,
  });
};

type ModalType = "create_route" | "filters" | null;

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

export default function VehicleRoutesList() {
  const { getGuaranteedProfile } = useProfile();
  const profile = getGuaranteedProfile();
  const { vehicleId } = useLocalSearchParams<{ vehicleId: string }>();
  const { styles, theme } = useStyles(stylesheet);
  const {
    routes,
    isLoading,
    isRefreshing,
    hasMorePages,
    error,
    currentPage,
    LIST_ONLY_fetchRoutes,
    setCurrentPage,
    setHasMorePages,
    setRoutes,
  } = useRoutes();
  const { activeRoute, activeRouteIsLoading, fetchActiveRouteIdStandalone, setActiveRouteId, activeRouteId } =
    useActiveRoute(profile.id);
  const [localStandAloneActiveRouteIsLoading, setLocalStandAloneActiveRouteIsLoading] = useState(false);
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [filtersAreActive, setFiltersAreActive] = useState(false);
  const closeModal = () => setActiveModal(null);
  const [locationIsLoading, setIsLocationLoading] = useState(false);

  const routeArray = Object.values(routes).filter((r) => r.vehicle_id === vehicleId);
  const { getElapsedTimeSince } = useElapsedTime();

  async function loadMoreRoutes() {
    if (hasMorePages && !isRefreshing && !isLoading) {
      await LIST_ONLY_fetchRoutes(currentPage + 1, 5, vehicleId);
    }
  }

  async function refetchRoutes() {
    setLocalStandAloneActiveRouteIsLoading(true);
    setRoutes({});

    if (activeRoute) {
      await fetchActiveRouteIdStandalone(activeRoute.id);
      setActiveRouteId(activeRoute.id);
    }

    setHasMorePages(true);
    setCurrentPage(1);
    await LIST_ONLY_fetchRoutes(1, 5, vehicleId);

    setLocalStandAloneActiveRouteIsLoading(false);
  }

  useEffect(() => {
    if (routeArray.length === 1 && activeRoute) {
      LIST_ONLY_fetchRoutes(1, 5, vehicleId);
    } else if (routeArray.length === 0) {
      LIST_ONLY_fetchRoutes(1, 5, vehicleId);
    }
  }, []);

  async function locationPermission() {
    setIsLocationLoading(true);

    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      showToast("Permiso denegado", "No tenemos permiso para acceder a tu ubicación.");
      setIsLocationLoading(false);
      return false;
    }

    setIsLocationLoading(false);
    return true;
  }

  if (error) {
    return (
      <ErrorScreen caption="No se pudieron cargar las rutas" buttonCaption="Reintentar" retryFunction={refetchRoutes} />
    );
  }

  if (isLoading && routeArray.length === 0) {
    return <FetchingIndicator caption="Cargando rutas" />;
  }

  if (activeRouteIsLoading || localStandAloneActiveRouteIsLoading) {
    return (
      <FetchingIndicator caption={activeRouteIsLoading ? "Cargando ruta en curso" : "Cargando ruta en curso local"} />
    );
  }

  async function showCreateRouteModal() {
    if (activeRoute && routes[activeRoute.id].is_active === false) {
      setActiveRouteId(null);
      showToast("Aviso", "Se sincronizó la ruta en curso. Crea una nueva ruta.");
      return;
    }

    if (!activeRoute) {
      if (await locationPermission()) {
        setActiveModal("create_route");
      }
      return;
    }

    if (activeRoute.is_active && activeRoute.user_id === profile.id) {
      alert(
        "No puedes crear una nueva ruta mientras estás en una ruta en curso. Finaliza la ruta en curso para poder crear una nueva."
      );
      return;
    }

    if (activeRoute.is_active && activeRoute.vehicle_id === vehicleId) {
      alert("No puedes crear una nueva ruta con este vehículo ya que tiene una ruta en curso. Debe finalizarse antes.");
      return;
    }
  }

  const canEdit = ["ADMIN", "OWNER"].includes(profile.role);

  return (
    <>
      <Modal close={closeModal} isOpen={activeModal === "create_route"}>
        <AddRouteModal close={closeModal} />
      </Modal>

      <Modal close={closeModal} isOpen={activeModal === "filters"}>
        <RoutesListFilterModal close={closeModal} />
      </Modal>

      {routeArray.length === 0 && (
        <>
          <Stack.Screen
            options={{
              title: `Rutas (0)`,
              headerRight: () => (
                <ActionButtonGroup>
                  <ActionButton
                    Icon={Plus}
                    text="Nueva ruta"
                    onPress={showCreateRouteModal}
                    show={!locationIsLoading}
                  />
                  {locationIsLoading && <ActivityIndicator />}
                  <ActionButton
                    onPress={refetchRoutes}
                    Icon={RotateCw}
                    text="Actualizar"
                    show={Platform.OS === "web"}
                  />
                </ActionButtonGroup>
              ),
            }}
          />
          <EmptyScreen
            caption="No hay rutas para este vehículo"
            buttonCaption="Reintentar"
            retryFunction={refetchRoutes}
          />
        </>
      )}

      {routeArray.length > 0 && (
        <>
          <Stack.Screen
            options={{
              title: `Rutas (${routeArray.length})`,
              headerRight: () => (
                <ActionButtonGroup>
                  <ActionButton Icon={Download} text="CSV" onPress={() => {}} show={canEdit} />
                  <ActionButton
                    Icon={filtersAreActive ? FilterX : FilterIcon}
                    text="Filtros"
                    onPress={() => setActiveModal("filters")}
                    show={canEdit}
                  />
                  <ActionButton Icon={Plus} text="Nueva ruta" onPress={showCreateRouteModal} />
                  <ActionButton
                    onPress={refetchRoutes}
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
            data={routeArray}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <SimpleList
                relativeToDirectory
                href={`./${item.id}`}
                leading={
                  <View style={{ flexDirection: "column", alignItems: "center", gap: 12 }}>
                    <StatusChip status={String(item.is_active)} statesConfig={statesConfig} />
                    {item.is_active && (
                      <View style={{ alignItems: "center", gap: 2 }}>
                        <Text style={styles.counterSubtitleText}>{`Tiempo transcurrido`}</Text>
                        <Text style={styles.counterText}>{getElapsedTimeSince(item.started_at)}</Text>
                      </View>
                    )}
                  </View>
                }
                content={
                  <>
                    <Text style={styles.itemTitle}>{item.title}</Text>
                    <Text style={styles.itemDetails}>{`Iniciada el ${formatDate(item.started_at, "")}`}</Text>
                    {!item.is_active && !item.ended_at && (
                      <Text style={styles.itemDetails}>
                        {`La ruta finalizó pero no se registró la hora de finalización`}
                      </Text>
                    )}
                  </>
                }
              />
            )}
            onEndReached={loadMoreRoutes}
            onEndReachedThreshold={0.5}
            onRefresh={refetchRoutes}
            refreshing={isLoading}
            ListEmptyComponent={<EmptyScreen caption="No hay rutas para este vehículo" />}
            ListFooterComponent={
              hasMorePages ? (
                <View style={styles.footer}>
                  <ActivityIndicator color={Platform.OS !== "ios" ? theme.ui.colors.primary : undefined} />
                </View>
              ) : (
                <Text style={styles.allVehiclesLoadedText}>Se han cargado todas las rutas</Text>
              )
            }
          />
        </>
      )}
    </>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  counterText: {
    fontSize: 27,
    color: theme.textPresets.main,
    fontFamily: "SpaceMono",
  },
  counterSubtitleText: {
    fontSize: 14,
    color: theme.textPresets.main,
  },
  itemTitle: {
    fontWeight: "bold",
    fontSize: 18,
    color: theme.textPresets.main,
  },
  itemDetails: {
    fontSize: 16,
    color: theme.textPresets.subtitle,
  },
  footer: {
    padding: 20,
    alignItems: "center",
  },
  allVehiclesLoadedText: {
    textAlign: "center",
    color: theme.textPresets.subtitle,
    padding: 20,
    fontSize: 16,
  },
}));
