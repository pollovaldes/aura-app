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

export function VehiclesList() {
  const { profile } = useProfile();
  const { vehicles, fetchVehicles } = useVehicle();
  const { styles } = useStyles(stylesheet);
  const [vehiclesAreLoading, setVehiclesAreLoading] = useState(true);
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMorePages, setHasMorePages] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const closeModal = () => setActiveModal(null);

  useEffect(() => {
    fetchAllVehicles();
  }, []);

  const fetchAllVehicles = async (page: number = 1) => {
    if (page === 1) {
      setVehiclesAreLoading(true);
    } else {
      setIsRefreshing(true);
    }

    try {
      const fetched = await fetchVehicles(page);
      setHasMorePages(fetched.length === 9);
      setCurrentPage(page);
    } catch (error) {
      if (page === 1) {
        setVehiclesAreLoading(false);
      }
    } finally {
      setVehiclesAreLoading(false);
      setIsRefreshing(false);
    }
  };

  const loadMoreVehicles = () => {
    if (hasMorePages && !isRefreshing) {
      fetchAllVehicles(currentPage + 1);
    }
  };

  const handleRefresh = () => {
    setHasMorePages(true);
    fetchAllVehicles(1);
  };

  const vehicleArray = Object.values(vehicles);

  if (vehiclesAreLoading && currentPage === 1) {
    return <FetchingIndicator caption="Cargando vehículos" />;
  }

  if (vehicleArray.length === 0) {
    return (
      <ErrorScreen
        caption="Ocurrió un error al cargar los vehículos"
        buttonCaption="Reintentar"
        retryFunction={() => fetchAllVehicles(1)}
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
                onPress={() => fetchAllVehicles(1)}
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
        onRefresh={handleRefresh}
        refreshing={isRefreshing}
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
