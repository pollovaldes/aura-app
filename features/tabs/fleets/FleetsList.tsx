import { ActionButton } from "@/components/actionButton/ActionButton";
import { ActionButtonGroup } from "@/components/actionButton/ActionButtonGroup";
import EmptyScreen from "@/components/dataStates/EmptyScreen";
import ErrorScreen from "@/components/dataStates/ErrorScreen";
import { FetchingIndicator } from "@/components/dataStates/FetchingIndicator";
import AddFleetModal from "@/components/fleets/AddFleetModal";
import Modal from "@/components/Modal/Modal";
import { SimpleList } from "@/components/simpleList/SimpleList";
import { useFleets } from "@/hooks/useFleets";
import useProfile from "@/hooks/useProfile";
import { Stack } from "expo-router";
import { Plus, RotateCw } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Platform, Text, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

type ModalType = "add_fleet_modal" | null;

export default function FleetsList() {
  const { getGuaranteedProfile } = useProfile();
  const profile = getGuaranteedProfile();
  const { fleets, isLoadingList, fetchFleetsPage, error, refreshAllFleets, loadMoreFleets, hasMoreFleets } =
    useFleets();
  const { styles, theme } = useStyles(stylesheet);
  const fleetArray = Object.values(fleets);
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const closeModal = () => setActiveModal(null);

  useEffect(() => {
    fetchFleetsPage();
  }, []);

  if (isLoadingList && fleetArray.length === 0) {
    return <FetchingIndicator caption="Cargando flotillas" />;
  }

  if (error) {
    return (
      <ErrorScreen
        caption="Ocurrió un error y no pudimos cargar las flotillas"
        buttonCaption="Reintentar"
        retryFunction={async () => {
          await refreshAllFleets();
        }}
      />
    );
  }

  return (
    <>
      <Modal close={closeModal} isOpen={activeModal === "add_fleet_modal"}>
        <AddFleetModal close={closeModal} />
      </Modal>

      <Stack.Screen
        options={{
          title: `Flotillas (${fleetArray.length})`,
          headerLargeTitle: true,
          headerRight: () => (
            <ActionButtonGroup>
              <ActionButton onPress={() => setActiveModal("add_fleet_modal")} Icon={Plus} text="Crear flotilla" />
              <ActionButton
                onPress={() => refreshAllFleets()}
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
        data={fleetArray}
        keyExtractor={(item) => item.id!}
        renderItem={({ item }) => {
          return (
            <SimpleList
              relativeToDirectory
              href={`./${item.id}`}
              content={
                <View style={styles.itemSeparator}>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  <Text style={styles.itemDetails}>{item.description}</Text>
                </View>
              }
            />
          );
        }}
        onEndReached={() => loadMoreFleets()}
        onEndReachedThreshold={0.5}
        onRefresh={() => refreshAllFleets()}
        refreshing={isLoadingList}
        ListEmptyComponent={<EmptyScreen caption="No hay flotillas por aquí." />}
        ListFooterComponent={
          hasMoreFleets ? (
            <View style={styles.footer}>
              <ActivityIndicator color={Platform.OS !== "ios" ? theme.ui.colors.primary : undefined} />
            </View>
          ) : fleetArray.length !== 0 ? (
            <Text style={styles.allFleetsLoadedText}>Se han cargado todas las flotillas</Text>
          ) : null
        }
      />
    </>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  itemSeparator: {
    gap: 6,
  },
  itemTitle: {
    fontWeight: "bold",
    fontSize: 20,
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
  allFleetsLoadedText: {
    textAlign: "center",
    color: theme.textPresets.subtitle,
    padding: 20,
    fontSize: 16,
  },
}));
