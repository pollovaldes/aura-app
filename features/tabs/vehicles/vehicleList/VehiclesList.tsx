import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Platform, Text, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { FetchingIndicator } from "@/components/dataStates/FetchingIndicator";
import EmptyScreen from "@/components/dataStates/EmptyScreen";
import AddVehicleComponent from "@/components/vehicles/AddVehicleComponent";
import useProfile from "@/hooks/useProfile";
import { SimpleList } from "@/components/simpleList/SimpleList";
import { Stack } from "expo-router";
import { ActionButtonGroup } from "@/components/actionButton/ActionButtonGroup";
import { ActionButton } from "@/components/actionButton/ActionButton";
import { Download, Plus, RotateCw } from "lucide-react-native";
import useVehicle from "@/hooks/truckHooks/useVehicle";
import ErrorScreen from "@/components/dataStates/ErrorScreen";

export default function VehiclesList() {
  const { profile } = useProfile();
  const { vehicles, fetchVehicles, currentPage, hasMorePages, setVehicles } = useVehicle();
  const { styles } = useStyles(stylesheet);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [vehiclesAreLoading, setVehiclesAreLoading] = useState(true); // Local loading state for initial fetch

  const fetchAllVehicles = async () => {
    setVehiclesAreLoading(true);
    setVehicles(null);
    await fetchVehicles(1);
    setVehiclesAreLoading(false);
  };

  useEffect(() => {
    fetchAllVehicles();
  }, []);

  if (vehiclesAreLoading) {
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

  const loadMoreVehicles = () => {
    if (hasMorePages) {
      fetchVehicles(currentPage + 1);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: `Vehículos (${vehicles?.length ?? 0})`,
          headerRight: () => (
            <ActionButtonGroup>
              <ActionButton onPress={() => {}} Icon={Download} text="Descargar datos" show={isAdminOrOwner} />
              <ActionButton
                onPress={() => setIsModalVisible(true)}
                Icon={Plus}
                text="Agregar vehículo"
                show={isAdminOrOwner}
              />
              <ActionButton onPress={fetchAllVehicles} Icon={RotateCw} text="Actualizar" show={Platform.OS === "web"} />
            </ActionButtonGroup>
          ),
        }}
      />
      <AddVehicleComponent visible={isModalVisible} onClose={() => setIsModalVisible(false)} />
      <FlatList
        contentInsetAdjustmentBehavior="automatic"
        data={vehicles}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SimpleList
            relativeToDirectory
            href={`./${item.id}`}
            //leading={<VehicleThumbnail vehicleId={item.id} />}
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
        onEndReachedThreshold={0.5}
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
