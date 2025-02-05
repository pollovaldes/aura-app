import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, KeyboardAvoidingView, Platform, Text, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { FetchingIndicator } from "@/components/dataStates/FetchingIndicator";
import EmptyScreen from "@/components/dataStates/EmptyScreen";
import useProfile from "@/hooks/useProfile";
import { SimpleList } from "@/components/simpleList/SimpleList";
import { Stack } from "expo-router";
import { ActionButtonGroup } from "@/components/actionButton/ActionButtonGroup";
import { ActionButton } from "@/components/actionButton/ActionButton";
import { Download, Plus, RotateCw } from "lucide-react-native";
import ErrorScreen from "@/components/dataStates/ErrorScreen";
import { useVehicles } from "@/hooks/truckHooks/useVehicle";
import { VehicleThumbnail } from "@/components/vehicles/VehicleThumbnail";
import Modal from "@/components/Modal/Modal";
import { AddVehicleModal } from "./modals/AddVehicleModal";

type ModalType = "add_vehicle_modal" | null;

export function VehiclesList() {
  const { getGuaranteedProfile } = useProfile();
  const profile = getGuaranteedProfile();
  const {
    vehicles,
    isLoading,
    hasMorePages,
    error,
    LIST_ONLY_loadMoreVehicles,
    handleRefresh,
    LIST_ONLY_fetchVehicles,
  } = useVehicles();
  const { styles, theme } = useStyles(stylesheet);
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const closeModal = () => setActiveModal(null);
  const vehicleArray = Object.values(vehicles);

  useEffect(() => {
    LIST_ONLY_fetchVehicles();
  }, []);

  if (error) {
    return (
      <ErrorScreen
        caption="Ocurrió un error y no pudimos cargar los vehículos"
        buttonCaption="Reintentar"
        retryFunction={async () => {
          await handleRefresh();
        }}
      />
    );
  }

  if (isLoading && vehicleArray.length === 0) {
    return <FetchingIndicator caption="Cargando vehículos" />;
  }

  const isAdminOrOwner = profile.role === "ADMIN" || profile.role === "OWNER";

  return (
    <>
      <Modal close={closeModal} isOpen={activeModal === "add_vehicle_modal"}>
        <AddVehicleModal close={closeModal} />
      </Modal>

      <Stack.Screen
        options={{
          title: `Vehículos (${vehicleArray.length})`,
          headerLargeTitle: true,
          headerRight: () => (
            <ActionButtonGroup>
              <ActionButton onPress={() => {}} Icon={Download} text="CSV" show={isAdminOrOwner} />
              <ActionButton
                onPress={() => setActiveModal("add_vehicle_modal")}
                Icon={Plus}
                text="Agregar vehículo"
                show={isAdminOrOwner}
              />
              <ActionButton
                onPress={() => handleRefresh()}
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
        data={vehicleArray}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SimpleList
            relativeToDirectory
            href={`./${item.id}`}
            leading={<VehicleThumbnail vehicleId={item.id} />}
            content={
              <View style={styles.itemSeparator}>
                <Text style={styles.itemTitle}>
                  {`${item.brand ?? "N/A"} ${item.sub_brand ?? "N/A"} (${item.year ?? "N/A"})`}
                </Text>
                <Text style={styles.itemDetails}>
                  {`Placa: ${item.plate ?? "N/A"}\nNúmero económico: ${item.economic_number ?? "N/A"}\nNúmero de serie: ${item.serial_number ?? "N/A"}`}
                </Text>
              </View>
            }
          />
        )}
        onEndReached={LIST_ONLY_loadMoreVehicles}
        onEndReachedThreshold={0.5}
        onRefresh={handleRefresh}
        refreshing={isLoading}
        ListEmptyComponent={<EmptyScreen caption="Ningún vehículo por aquí." />}
        ListFooterComponent={
          hasMorePages ? (
            <View style={styles.footer}>
              <ActivityIndicator color={Platform.OS !== "ios" ? theme.ui.colors.primary : undefined} />
            </View>
          ) : vehicleArray.length !== 0 ? (
            <Text style={styles.allVehiclesLoadedText}>Se han cargado todos los vehículos</Text>
          ) : null
        }
      />
    </>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: theme.marginsComponents.section,
  },
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
  allVehiclesLoadedText: {
    textAlign: "center",
    color: theme.textPresets.subtitle,
    padding: 20,
    fontSize: 16,
  },
}));
