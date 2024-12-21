import React, { useState } from "react";
import { FlatList, Text } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { router, Stack } from "expo-router";
import { Download, Layers, Plus } from "lucide-react-native";
import { FetchingIndicator } from "@/components/dataStates/FetchingIndicator";
import ErrorScreen from "@/components/dataStates/ErrorScreen";
import EmptyScreen from "@/components/dataStates/EmptyScreen";
import AddVehicleComponent from "@/components/vehicles/AddVehicleComponent";
import VehicleThumbnail from "@/components/vehicles/TruckThumbnail";
import { ActionButtonGroup } from "@/components/actionButton/ActionButtonGroup";
import { ActionButton } from "@/components/actionButton/ActionButton";
import useVehicle from "@/hooks/truckHooks/useVehicle";
import useProfile from "@/hooks/useProfile";
import { SimpleList } from "@/components/simpleList/SimpleList";

export default function VehiclesList() {
  const { vehicles, vehiclesAreLoading, fetchVehicles } = useVehicle();
  const { profile, isProfileLoading, fetchProfile } = useProfile();
  const { styles } = useStyles(stylesheet);
  const [isModalVisible, setIsModalVisible] = useState(false);

  if (isProfileLoading || vehiclesAreLoading) {
    return (
      <>
        <Stack.Screen
          options={{
            headerRight: undefined,
          }}
        />
        <FetchingIndicator caption={isProfileLoading ? "Cargando perfil" : "Cargando vehículos"} />
      </>
    );
  }

  if (!profile) {
    return (
      <>
        <Stack.Screen
          options={{
            headerRight: undefined,
          }}
        />
        <ErrorScreen
          caption="Ocurrió un error al recuperar tu perfil"
          buttonCaption="Reintentar"
          retryFunction={fetchProfile}
        />
      </>
    );
  }

  if (!vehicles) {
    return (
      <>
        <Stack.Screen
          options={{
            headerRight: undefined,
          }}
        />
        <ErrorScreen
          caption="Ocurrió un error al recuperar los vehículos"
          buttonCaption="Reintentar"
          retryFunction={fetchVehicles}
        />
      </>
    );
  }

  const headerRight = () => {
    const canEdit = profile.role === "ADMIN" || profile.role === "OWNER";
    return (
      <ActionButtonGroup>
        <ActionButton onPress={() => router.push("/tab")} Icon={Layers} />
        <ActionButton onPress={() => {}} Icon={Download} />
        <ActionButton onPress={() => setIsModalVisible(true)} Icon={Plus} show={canEdit} />
      </ActionButtonGroup>
    );
  };

  if (vehicles.length === 0) {
    return (
      <>
        <Stack.Screen
          options={{
            headerRight: headerRight,
          }}
        />
        <EmptyScreen caption="Ningún vehículo por aquí" buttonCaption="Actualizar" retryFunction={fetchVehicles} />
      </>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: headerRight,
        }}
      />
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
        ListEmptyComponent={<EmptyScreen caption="Ningún vehículo por aquí" />}
      />
      <AddVehicleComponent visible={isModalVisible} onClose={() => setIsModalVisible(false)} />
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
