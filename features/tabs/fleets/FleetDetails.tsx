import { ActionButton } from "@/components/actionButton/ActionButton";
import { ActionButtonGroup } from "@/components/actionButton/ActionButtonGroup";
import EmptyScreen from "@/components/dataStates/EmptyScreen";
import ErrorScreen from "@/components/dataStates/ErrorScreen";
import { FetchingIndicator } from "@/components/dataStates/FetchingIndicator";
import UnauthorizedScreen from "@/components/dataStates/UnauthorizedScreen";
import UserThumbnail from "@/components/people/UserThumbnail";
import { SimpleList } from "@/components/simpleList/SimpleList";
import { VehicleThumbnail } from "@/components/vehicles/VehicleThumbnail";
import { useFleets } from "@/hooks/useFleets";
import useProfile from "@/hooks/useProfile";
import { User, Vehicle } from "@/types/globalTypes";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { router, Stack, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { FlatList, Text } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

export default function FleetDetails() {
  const { styles } = useStyles(stylesheet);
  const { getGuaranteedProfile } = useProfile();
  const profile = getGuaranteedProfile();
  const { fleetId } = useLocalSearchParams<{ fleetId: string }>();
  const { areFleetsLoading, fetchFleets, fleets } = useFleets(fleetId);
  const [currentTabIndex, setCurrentTabIndex] = useState(0);

  if (areFleetsLoading) {
    return <FetchingIndicator caption={"Cargando flotillas"} />;
  }

  if (!fleets) {
    return (
      <ErrorScreen
        caption="Ocurrió un error al recuperar las flotillas"
        buttonCaption="Reintentar"
        retryFunction={fetchFleets}
      />
    );
  }

  if (fleets.length === 0) {
    return (
      <>
        <UnauthorizedScreen
          caption="No tienes acceso a este recurso"
          buttonCaption="Reintentar"
          retryFunction={fetchFleets}
        />
        <Stack.Screen
          options={{
            title: "Error",
            headerRight: undefined,
            headerLargeTitle: false,
          }}
        />
      </>
    );
  }

  const capitalizeWords = (text: string | null | undefined): string => {
    if (!text) return "";
    return text
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const canAddFleet = profile.role === "ADMIN" || profile.role === "OWNER";
  const fleet = fleets[0];

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "Administrador";
      case "DRIVER":
        return "Conductor";
      case "BANNED":
        return "Bloqueado";
      case "NO_ROLE":
        return "Sin rol";
      case "OWNER":
        return "Dueño";
      default:
        return "Indefinido";
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerLargeTitle: true,
          title: fleet.title,
          headerRight: () => (
            <ActionButtonGroup>
              <ActionButton
                text="Editar"
                onPress={
                  currentTabIndex === 0
                    ? () =>
                        router.push("./edit_people", {
                          relativeToDirectory: true,
                        })
                    : () =>
                        router.push("./edit_vehicles", {
                          relativeToDirectory: true,
                        })
                }
                show={canAddFleet}
              />
            </ActionButtonGroup>
          ),
        }}
      />
      <FlatList
        contentInsetAdjustmentBehavior="automatic"
        data={currentTabIndex === 0 ? (fleet.users as User[]) : (fleet.vehicles as Vehicle[])}
        keyExtractor={(item) => item.id}
        refreshing={areFleetsLoading}
        onRefresh={fetchFleets}
        ListHeaderComponent={
          <SegmentedControl
            values={["Personas", "Vehículos"]}
            selectedIndex={currentTabIndex}
            onChange={(event) => setCurrentTabIndex(event.nativeEvent.selectedSegmentIndex)}
            style={styles.segmentedControl}
          />
        }
        style={styles.list}
        renderItem={({ item }) =>
          currentTabIndex === 0 ? (
            <SimpleList
              relativeToDirectory
              href={`/tab/user_details/${item.id}`}
              leading={<UserThumbnail userId={item.id} size={60} />}
              content={
                <>
                  <Text
                    style={styles.userText}
                  >{`${item.name} ${item.father_last_name} ${item.mother_last_name}`}</Text>
                  <Text style={styles.userTextSubtitle}>{getRoleLabel(item.role)}</Text>
                </>
              }
            />
          ) : (
            <SimpleList
              relativeToDirectory
              href={`/tab/vehicle_details/${item.id}`}
              leading={<VehicleThumbnail vehicleId={item.id} />}
              content={
                <>
                  <Text style={styles.vehicleTitle}>{`${item.brand} ${item.sub_brand} (${item.year})`}</Text>
                  <Text style={styles.vehicleDetails}>
                    {`Placa: ${item.plate}\nNúmero económico: ${item.economic_number}`}
                  </Text>
                </>
              }
            />
          )
        }
        ListEmptyComponent={
          <EmptyScreen
            caption={currentTabIndex === 0 ? "No hay personas en esta flotilla" : "No hay vehículos en esta flotilla"}
          />
        }
      />
    </>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  list: {
    marginBottom: 36,
  },
  segmentedControl: {
    width: "98.5%",
    marginHorizontal: "auto",
    marginVertical: 6,
  },
  userText: {
    fontSize: 18,
    color: theme.textPresets.main,
  },
  userTextSubtitle: {
    fontSize: 15,
    color: theme.textPresets.subtitle,
  },
  vehicleTitle: {
    fontWeight: "bold",
    fontSize: 18,
    color: theme.textPresets.main,
  },
  vehicleDetails: {
    fontSize: 15,
    color: theme.textPresets.subtitle,
  },
}));
