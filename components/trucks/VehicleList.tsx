import { View, Text, FlatList, Pressable } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { Link, Stack } from "expo-router";
import AddTruckComponent from "./AddVehicleComponent";
import { useEffect, useState } from "react";
import { ChevronRight, Plus } from "lucide-react-native";
import { useSearch } from "@/context/SearchContext";
import useProfile from "@/hooks/useProfile";
import useVehicle from "@/hooks/truckHooks/useVehicle";
import LoadingScreen from "../dataStates/LoadingScreen";
import ErrorScreen from "../dataStates/ErrorScreen";
import EmptyScreen from "../dataStates/EmptyScreen";
import TruckThumbnail from "./TruckThumbnail";

export default function VehicleList() {
  const { vehicles, vehiclesAreLoading, fetchVehicles } = useVehicle();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [filteredVehicles, setFilteredVehicles] = useState(vehicles);
  const { role } = useProfile();
  const { styles } = useStyles(stylesheet);
  const { searchState } = useSearch();
  const searchQuery = searchState["trucks"] || "";

  useEffect(() => {
    if (searchQuery && vehicles) {
      const filtered = vehicles.filter((truck) =>
        `${truck.economic_number} ${truck.brand} ${truck.sub_brand} (${truck.year})`
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
      setFilteredVehicles(filtered);
    } else {
      setFilteredVehicles(vehicles);
    }
  }, [searchQuery, vehicles]);

  if (vehiclesAreLoading) {
    return <LoadingScreen caption="Cargando vehículos" />;
  }

  if (vehicles === null) {
    return (
      <ErrorScreen
        caption={`Ocurrió un error y no \npudimos cargar los vehículos`}
        buttonCaption="Reintentar"
        retryFunction={fetchVehicles}
      />
    );
  }

  if (vehicles.length === 0) {
    return <EmptyScreen caption="Ningún vehículo por aquí" />;
  }

  if (filteredVehicles?.length === 0 && searchQuery) {
    return <EmptyScreen caption="Ningún resultado" />;
  }

  return (
    <>
      {role === "ADMIN" && (
        <Stack.Screen
          options={{
            headerRight: () => (
              <Pressable onPress={() => setIsModalVisible(true)}>
                <Plus color={styles.plusIcon.color} />
              </Pressable>
            ),
          }}
        />
      )}
      <FlatList
        refreshing={vehiclesAreLoading}
        onRefresh={fetchVehicles}
        contentInsetAdjustmentBehavior="automatic"
        data={filteredVehicles}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Link href={{ pathname: `/vehicles/${item.id}` }} asChild>
            <Pressable>
              <View style={styles.container}>
                <View style={styles.contentContainer}>
                  <View style={styles.imageContainer}>
                    <TruckThumbnail vehicleId={item.id} />
                  </View>
                  <Text style={styles.itemText}>
                    <Text
                      style={{ fontWeight: "bold" }}
                    >{`${item.brand} ${item.sub_brand} (${item.year})\n`}</Text>
                    {`Placas: ${item.plate}\n`}
                    {`Número económico: ${item.economic_number}\n`}
                  </Text>
                </View>
                <View style={styles.chevronView}>
                  <ChevronRight color={styles.chevron.color} />
                </View>
              </View>
            </Pressable>
          </Link>
        )}
      />
      <AddTruckComponent
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      />
    </>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  container: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: theme.ui.colors.border,
  },
  loadingContainer: {
    gap: 6,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: theme.textPresets.subtitle,
  },
  errorText: {
    color: "red",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  lackText: {
    fontSize: 16,
    color: theme.textPresets.main,
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  imageContainer: {
    padding: 12,
  },
  image: {
    borderRadius: 6,
    width: 100,
    height: 100,
  },
  emptyImageContainer: {
    borderRadius: 6,
    backgroundColor: theme.ui.colors.border,
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  noImageIcon: {
    color: theme.textPresets.main,
  },
  itemText: {
    fontSize: 18,
    paddingLeft: 10,
    color: theme.textPresets.main,
    flexShrink: 1,
    marginRight: 18,
  },
  plusIcon: {
    fontSize: 16,
    color: theme.ui.colors.primary,
  },
  chevron: {
    color: theme.textPresets.subtitle,
  },
  chevronView: {
    paddingRight: 12,
  },
}));
