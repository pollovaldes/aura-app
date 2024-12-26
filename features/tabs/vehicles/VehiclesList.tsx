import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Platform, Text, View } from "react-native";
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
import { useVehicle } from "@/hooks/truckHooks/useVehicle";
import { VehicleThumbnail } from "@/components/vehicles/VehicleThumbnail";
import Modal from "@/components/Modal/Modal";
import { AddVehicleModal } from "./modals/AddVehicleModal";

type ModalType = "add_vehicle_modal" | null;

export default function VehiclesList() {
  const { profile } = useProfile();
  const { vehicles, fetchVehicles, currentPage, hasMorePages, setVehicles } = useVehicle();
  const { styles } = useStyles(stylesheet);
  const [vehiclesAreLoading, setVehiclesAreLoading] = useState(true); // Local loading state for initial fetch
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const closeModal = () => setActiveModal(null);

  useEffect(() => {
    fetchAllVehicles();
  }, []);

  const fetchAllVehicles = async () => {
    setVehiclesAreLoading(true);
    setVehicles(null);
    await fetchVehicles(1);
    setVehiclesAreLoading(false);
  };

  const loadMoreVehicles = () => {
    if (hasMorePages) {
      fetchVehicles(currentPage + 1);
    }
  };

  if (vehiclesAreLoading && !vehicles) {
    return <FetchingIndicator caption="Cargando vehículos" />;
  }

  if (!vehicles) {
    return (
      <ErrorScreen
        caption="Ocurrió un error al cargar los vehículos"
        buttonCaption="Reintentar"
        retryFunction={fetchAllVehicles}
      />
    );
  }

  const isAdminOrOwner = profile?.role === "ADMIN" || profile?.role === "OWNER";

  return (
    <>
      <Modal close={closeModal} isOpen={activeModal === "add_vehicle_modal"}>
        <AddVehicleModal close={closeModal} />
      </Modal>
      <Stack.Screen
        options={{
          title: `Vehículos (${vehicles?.length ?? 0})`,
          headerRight: () => (
            <ActionButtonGroup>
              <ActionButton onPress={() => {}} Icon={Download} text="CSV" show={isAdminOrOwner} />
              <ActionButton
                onPress={() => setActiveModal("add_vehicle_modal")}
                Icon={Plus}
                text="Agregar vehículo"
                show={isAdminOrOwner}
              />
              <ActionButton onPress={fetchAllVehicles} Icon={RotateCw} text="Actualizar" show={Platform.OS === "web"} />
            </ActionButtonGroup>
          ),
        }}
      />
      <FlatList
        contentInsetAdjustmentBehavior="automatic"
        data={vehicles}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SimpleList
            relativeToDirectory
            href={`./${item.id}`}
            leading={<VehicleThumbnail vehicleId={item.id} />}
            content={
              <>
                <Text
                  style={styles.itemTitle}
                >{`${item.brand ?? "N/A"} ${item.sub_brand ?? "N/A"} (${item.year ?? "N/A"})`}</Text>
                <Text style={styles.itemDetails}>
                  {`Placa: ${item.plate ?? "N/A"}\nNúmero económico: ${item.economic_number ?? "N/A"}\nNúmero de serie: ${item.serial_number ?? "N/A"}`}
                </Text>
              </>
            }
          />
        )}
        onEndReached={loadMoreVehicles}
        onEndReachedThreshold={0.75}
        onRefresh={fetchAllVehicles}
        refreshing={false}
        ListEmptyComponent={<EmptyScreen caption="Ningún vehículo por aquí." />}
        ListFooterComponent={
          hasMorePages ? (
            <View style={{ padding: 20 }}>
              <ActivityIndicator />
            </View>
          ) : (
            <Text style={styles.allVehiclesLoadedText}>Se han cargado todos los vehículos</Text>
          )
        }
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
  itemDetails: {
    fontSize: 15,
    color: theme.textPresets.subtitle,
  },
  allVehiclesLoadedText: {
    textAlign: "center",
    color: theme.textPresets.subtitle,
    padding: 20,
    fontSize: 28,
  },
}));
