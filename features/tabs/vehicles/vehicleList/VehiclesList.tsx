import React, { useState } from "react";
import { FlatList, Text } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { FetchingIndicator } from "@/components/dataStates/FetchingIndicator";
import ErrorScreen from "@/components/dataStates/ErrorScreen";
import EmptyScreen from "@/components/dataStates/EmptyScreen";
import AddVehicleComponent from "@/components/vehicles/AddVehicleComponent";
import VehicleThumbnail from "@/components/vehicles/TruckThumbnail";
import useVehicle from "@/hooks/truckHooks/useVehicle";
import useProfile from "@/hooks/useProfile";
import { SimpleList } from "@/components/simpleList/SimpleList";
import { Stack } from "expo-router";
import { ActionButtonGroup } from "@/components/actionButton/ActionButtonGroup";
import { ActionButton } from "@/components/actionButton/ActionButton";
import { Download, Plus } from "lucide-react-native";

export default function VehiclesList() {
  const { profile } = useProfile();
  const { vehicles, vehiclesAreLoading, fetchVehicles } = useVehicle();
  const { styles } = useStyles(stylesheet);
  const [isModalVisible, setIsModalVisible] = useState(false);

  if (vehiclesAreLoading) {
    return <FetchingIndicator caption={"Cargando vehículos"} />;
  }

  if (!vehicles) {
    return (
      <ErrorScreen
        caption="Ocurrió un error al recuperar los vehículos."
        buttonCaption="Reintentar"
        retryFunction={fetchVehicles}
      />
    );
  }

  const isAdminOrOwner = profile?.role === "ADMIN" || profile?.role === "OWNER";

  return (
    <>
      <Stack.Screen
        options={{
          title: "Vehículos",
          headerRight: () => (
            <ActionButtonGroup>
              <ActionButton onPress={() => {}} Icon={Download} text="Descargar datos" show={isAdminOrOwner} />
              <ActionButton
                onPress={() => setIsModalVisible(true)}
                Icon={Plus}
                text="Agregar vehículo"
                show={isAdminOrOwner}
              />
            </ActionButtonGroup>
          ),
        }}
      />
      <AddVehicleComponent visible={isModalVisible} onClose={() => setIsModalVisible(false)} />
      <FlatList
        refreshing={vehiclesAreLoading}
        onRefresh={fetchVehicles}
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
                <Text style={styles.itemTitle}>{`${item.brand} ${item.sub_brand} (${item.year})`}</Text>
                <Text style={styles.itemDetails}>
                  {`Placa: ${item.plate}\nNúmero económico: ${item.economic_number}`}
                </Text>
              </>
            }
          />
        )}
        ListEmptyComponent={<EmptyScreen caption="Ningún vehículo por aquí." />}
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
}));
