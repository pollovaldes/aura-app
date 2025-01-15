import { ActionButton } from "@/components/actionButton/ActionButton";
import { ActionButtonGroup } from "@/components/actionButton/ActionButtonGroup";
import Modal from "@/components/Modal/Modal";
import { Stack, useLocalSearchParams } from "expo-router";
import { Download, FilterIcon, Plus, RotateCw } from "lucide-react-native";
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

type ModalType = "create_route" | null;

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

export default function VehichleRoutesList() {
  const { styles } = useStyles(stylesheet);
  const { getGuaranteedProfile } = useProfile();
  const profile = getGuaranteedProfile();
  const { vehicleId } = useLocalSearchParams<{ vehicleId: string }>();
  const {
    routes,
    isLoading,
    isRefreshing,
    hasMorePages,
    error,
    currentPage,
    LIST_ONLY_fetchRoutes,
    setRoutes,
    setCurrentPage,
    setHasMorePages,
  } = useRoutes();
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const closeModal = () => setActiveModal(null);
  const routeArray = Object.values(routes).filter((route) => route.vehicle_id === vehicleId);
  const { getElapsedTimeSince, getStaticValues } = useElapsedTime();

  async function loadMoreRoutes() {
    if (hasMorePages && !isRefreshing && !isLoading) {
      await LIST_ONLY_fetchRoutes(currentPage + 1, 5, vehicleId);
    }
  }

  async function refetchRoutes() {
    setRoutes({});
    setHasMorePages(true);
    setCurrentPage(1);
    await LIST_ONLY_fetchRoutes(1, 5, vehicleId);
  }

  useEffect(() => {
    if (routeArray.length === 0) {
      LIST_ONLY_fetchRoutes(1, 5, vehicleId);
    }
  }, []);

  if (error) {
    return (
      <ErrorScreen caption="No se pudieron cargar las rutas" buttonCaption="Reintentar" retryFunction={refetchRoutes} />
    );
  }

  if (isLoading && routeArray.length === 0) {
    return <FetchingIndicator caption="Cargando rutas" />;
  }

  const canEdit = ["ADMIN", "OWNER"].includes(profile.role);

  return (
    <>
      <Modal close={closeModal} isOpen={activeModal === "create_route"}>
        <AddRouteModal close={closeModal} />
      </Modal>

      {routeArray.length === 0 && (
        <>
          <Stack.Screen
            options={{
              title: `Rutas (${routeArray.length})`,
              headerRight: () => (
                <ActionButtonGroup>
                  <ActionButton Icon={Plus} text="Nueva ruta" onPress={() => setActiveModal("create_route")} />
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
                  <ActionButton Icon={FilterIcon} text="Filtros" onPress={() => {}} show={canEdit} />
                  <ActionButton Icon={Plus} text="Nueva ruta" onPress={() => setActiveModal("create_route")} />
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
                        <Text style={styles.counterText}>{`${getElapsedTimeSince(item.started_at)}`}</Text>
                      </View>
                    )}
                  </View>
                }
                content={
                  <>
                    <Text style={styles.itemTitle}>{`${item.title}`}</Text>
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
            refreshing={isRefreshing}
            ListEmptyComponent={<EmptyScreen caption="No hay rutas para este vehículo" />}
            ListFooterComponent={
              hasMorePages ? (
                <View style={styles.footer}>
                  <ActivityIndicator />
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
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: theme.marginsComponents.section,
  },
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
  itemDescription: {
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
