import { ActionButton } from "@/components/actionButton/ActionButton";
import { ActionButtonGroup } from "@/components/actionButton/ActionButtonGroup";
import EmptyScreen from "@/components/dataStates/EmptyScreen";
import { FetchingIndicator } from "@/components/dataStates/FetchingIndicator";
import UnauthorizedScreen from "@/components/dataStates/UnauthorizedScreen";
import { SimpleList } from "@/components/simpleList/SimpleList";
import { VehicleThumbnail } from "@/components/vehicles/VehicleThumbnail";
import { useUsers } from "@/hooks/peopleHooks/useUsers";
import { useVehicles } from "@/hooks/truckHooks/useVehicle";
import { useFleets } from "@/hooks/useFleets";
import useProfile from "@/hooks/useProfile";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { useHeaderHeight } from "@react-navigation/elements";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { Pencil, Plus, RotateCw } from "lucide-react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { FlatList, Platform, Text, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

export default function FleetDetails() {
  const { styles } = useStyles(stylesheet);
  const { getGuaranteedProfile } = useProfile();
  const profile = getGuaranteedProfile();
  const { fleetId } = useLocalSearchParams<{ fleetId: string }>();
  const { fleets, fetchFleetById, refreshFleetById } = useFleets();
  const { vehicles } = useVehicles();
  const { users } = useUsers();
  const [fleetIsLoading, setFleetIsLoading] = useState(true);
  const [currentTabIndex, setCurrentTabIndex] = useState(0);
  const headerHeight = useHeaderHeight();
  const [offsetTop, setOffsetTop] = useState(headerHeight);

  useLayoutEffect(() => {
    setOffsetTop(headerHeight);
  }, [headerHeight]);

  async function fetchFleet() {
    setFleetIsLoading(true);
    await fetchFleetById(fleetId);
    setFleetIsLoading(false);
  }

  async function refetchFleet() {
    setFleetIsLoading(true);
    await refreshFleetById(fleetId);
    setFleetIsLoading(false);
  }

  useEffect(() => {
    fetchFleet();
  }, []);

  if (fleetIsLoading) {
    return <FetchingIndicator caption={"Cargando flotilla"} />;
  }

  const fleet = fleets[fleetId];

  if (!fleet) {
    return (
      <>
        <Stack.Screen options={{ title: "Recurso inaccesible", headerLargeTitle: false }} />
        <UnauthorizedScreen
          caption="No tienes acceso a este recurso."
          buttonCaption="Reintentar"
          retryFunction={refetchFleet}
        />
      </>
    );
  }

  if (fleet.vehicleIds === undefined || fleet.userIds === undefined) {
    fleet.vehicleIds = [];
    fleet.userIds = [];
  }

  const fleetVehicles = fleet.vehicleIds.map((id) => vehicles[id]).filter(Boolean);
  const fleetUsers = fleet.userIds.map((id) => users[id]).filter(Boolean);

  const canAddFleet = profile.role === "ADMIN" || profile.role === "OWNER";

  return (
    <>
      <Stack.Screen
        options={{
          headerLargeTitle: true,
          title: fleet.title,
          headerRight: () => (
            <ActionButtonGroup>
              <ActionButton
                Icon={Pencil}
                text="Editar flotilla"
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
              <ActionButton
                Icon={Plus}
                text={currentTabIndex === 0 ? "Agregar personas" : "Agregar vehículos"}
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
              <ActionButton
                onPress={() => {
                  refetchFleet();
                }}
                Icon={RotateCw}
                text="Actualizar"
                show={Platform.OS === "web"}
              />
            </ActionButtonGroup>
          ),
        }}
      />

      <>
        <View style={styles.segmentedControlContainer(offsetTop)}>
          <SegmentedControl
            values={["Personas", "Vehículos"]}
            selectedIndex={currentTabIndex}
            onChange={(event) => setCurrentTabIndex(event.nativeEvent.selectedSegmentIndex)}
            style={styles.segmentedControl}
          />
        </View>
        {currentTabIndex === 0 ? (
          <FlatList
            data={fleetUsers}
            keyExtractor={(item) => item.id}
            refreshing={fleetIsLoading}
            onRefresh={refetchFleet}
            style={styles.list}
            renderItem={({ item }) =>
              currentTabIndex === 0 ? (
                <></>
              ) : (
                <SimpleList
                  relativeToDirectory
                  href={`/tab/vehicle_details/${item.id}`}
                  leading={<VehicleThumbnail vehicleId={item.id} />}
                  content={
                    <Text
                      style={styles.itemTitle}
                    >{`${item.name} ${item.father_last_name} ${item.mother_last_name}`}</Text>
                  }
                />
              )
            }
            ListEmptyComponent={
              <EmptyScreen
                caption={
                  currentTabIndex === 0 ? "No hay personas en esta flotilla" : "No hay vehículos en esta flotilla"
                }
              />
            }
          />
        ) : (
          <FlatList
            data={fleetVehicles}
            keyExtractor={(item) => item.id}
            refreshing={fleetIsLoading}
            onRefresh={refetchFleet}
            style={styles.list}
            renderItem={({ item }) =>
              currentTabIndex === 0 ? (
                <></>
              ) : (
                <SimpleList
                  relativeToDirectory
                  href={`/tab/vehicle_details/${item.id}`}
                  leading={<VehicleThumbnail vehicleId={item.id} />}
                  content={
                    <View style={styles.itemSeparator}>
                      <Text style={styles.itemTitle}>
                        {`${item.brand ?? "N/A"} ${item.sub_brand ?? "N/A"} (${item.year ?? "N/A"})`}
                      </Text>
                      <Text style={styles.itemSubtitle}>
                        {`Placa: ${item.plate ?? "N/A"}\nNúmero económico: ${item.economic_number ?? "N/A"}\nNúmero de serie: ${item.serial_number ?? "N/A"}`}
                      </Text>
                    </View>
                  }
                />
              )
            }
            ListEmptyComponent={
              <EmptyScreen
                caption={
                  currentTabIndex === 0 ? "No hay personas en esta flotilla" : "No hay vehículos en esta flotilla"
                }
              />
            }
          />
        )}
      </>
    </>
  );
}

const stylesheet = createStyleSheet((theme, runtime) => ({
  list: {
    marginBottom: 36,
    flex: 1,
  },
  segmentedControlContainer: (headerHeight: number) => ({
    paddingTop: Platform.OS === "ios" ? headerHeight : undefined,
  }),
  segmentedControl: {
    width: runtime.screen.width >= 750 ? 520 : "98.5%",
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
  itemTitle: {
    fontWeight: "bold",
    fontSize: 18,
    color: theme.textPresets.main,
  },
  itemSubtitle: {
    fontSize: 15,
    color: theme.textPresets.subtitle,
  },
  itemSeparator: {
    gap: 6,
  },
}));
