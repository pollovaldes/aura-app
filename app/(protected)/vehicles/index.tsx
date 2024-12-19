import React, { useState } from "react";
import { FlatList, Text } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { Stack } from "expo-router";
import { ChevronRight, Download, Plus } from "lucide-react-native";
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

export default function VehicleList() {
  const { vehicles, vehiclesAreLoading, fetchVehicles } = useVehicle();
  const { profile, isProfileLoading, fetchProfile } = useProfile();
  const { styles } = useStyles(stylesheet);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const headerRight = () => {
    return (
      <ActionButtonGroup>
        <ActionButton onPress={handleDownloadCsv} Icon={Download} />
        <ActionButton
          onPress={() => setIsModalVisible(true)}
          Icon={Plus}
          show={canEdit}
        />
      </ActionButtonGroup>
    );
  };

  if (isProfileLoading || vehiclesAreLoading) {
    return (
      <>
        <Stack.Screen
          options={{
            headerRight: undefined,
          }}
        />
        <FetchingIndicator
          caption={isProfileLoading ? "Cargando perfil" : "Cargando vehículos"}
        />
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

  const canEdit = profile.role === "ADMIN" || profile.role === "OWNER";

  if (vehicles.length === 0) {
    return (
      <>
        <Stack.Screen
          options={{
            headerRight: headerRight,
          }}
        />
        <EmptyScreen
          caption="Ningún vehículo por aquí"
          buttonCaption="Actualizar"
          retryFunction={fetchVehicles}
        />
      </>
    );
  }

  const handleDownloadCsv = async () => {
    try {
      console.log("Exporting CSV...");
    } catch (error) {
      console.error("Error downloading CSV:", error);
    }
  };

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
            href={`/vehicles/${item.id}`}
            leading={<VehicleThumbnail vehicleId={item.id} />}
            content={
              <>
                <Text
                  style={styles.itemTitle}
                >{`${item.brand} ${item.sub_brand} (${item.year})`}</Text>
                <Text style={styles.itemDetails}>
                  {`Placa: ${item.plate}\nNúmero económico: ${item.economic_number}`}
                </Text>
              </>
            }
            trailing={<ChevronRight color={styles.chevron.color} />}
          />
        )}
        ListEmptyComponent={
          <EmptyScreen
            caption="Ningún vehículo por aquí"
            buttonCaption="Actualizar"
            retryFunction={fetchVehicles}
          />
        }
      />

      <AddVehicleComponent
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
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
  chevron: {
    color: theme.textPresets.subtitle,
  },
}));
