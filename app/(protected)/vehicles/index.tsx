import {
  View,
  Text,
  FlatList,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { Link, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { ChevronRight, Download, Plus } from "lucide-react-native";
import { useSearch } from "@/context/SearchContext";
import useProfile from "@/hooks/useProfile";
import useVehicle from "@/hooks/truckHooks/useVehicle";
import React from "react";
import { exportVehiclesToCsv } from "@/hooks/cvsLogic/csvExportVehicles";
import { FetchingIndicator } from "@/components/dataStates/FetchingIndicator";
import ErrorScreen from "@/components/dataStates/ErrorScreen";
import EmptyScreen from "@/components/dataStates/EmptyScreen";
import AddVehicleComponent from "@/components/vehicles/AddVehicleComponent";
import VehicleThumbnail from "@/components/vehicles/TruckThumbnail";

export default function VehicleList() {
  const { vehicles, vehiclesAreLoading, fetchVehicles } = useVehicle();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [filteredVehicles, setFilteredVehicles] = useState(vehicles);
  const { profile, isProfileLoading, fetchProfile } = useProfile();
  const { styles } = useStyles(stylesheet);
  const { searchState } = useSearch();
  const searchQuery = searchState["trucks"] || "";

  useEffect(() => {
    if (searchQuery && vehicles) {
      const filtered = vehicles.filter((truck) =>
        `${truck.economic_number} ${truck.brand} ${truck.sub_brand} (${truck.year}) ${truck.plate}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
      setFilteredVehicles(filtered);
    } else {
      setFilteredVehicles(vehicles);
    }
  }, [searchQuery, vehicles]);

  if (isProfileLoading || vehiclesAreLoading) {
    return (
      <>
        <FetchingIndicator
          caption={isProfileLoading ? "Cargando perfil" : "Cargando vehículos"}
        />
      </>
    );
  }

  if (!profile) {
    return (
      <ErrorScreen
        caption="Ocurrió un error al recuperar tu perfil"
        buttonCaption="Reintentar"
        retryFunction={fetchProfile}
      />
    );
  }

  if (!vehicles) {
    return (
      <ErrorScreen
        caption={`Ocurrió un error al recuperar los vehículos`}
        buttonCaption="Reintentar"
        retryFunction={fetchVehicles}
      />
    );
  }

  if (vehicles.length === 0) {
    return (
      <EmptyScreen
        caption="Ningún vehículo por aquí"
        buttonCaption="Actualizar"
        retryFunction={fetchVehicles}
      />
    );
  }

  if (filteredVehicles?.length === 0 && searchQuery) {
    return <EmptyScreen caption="Ningún resultado" />;
  }

  const handleDownloadCsv = async () => {
    try {
      await exportVehiclesToCsv();
    } catch (error) {
      console.error("Error downloading CSV:", error);
      // You might want to show an error message to the user here
    }
  };

  return (
    <>
      {profile.role === "ADMIN" ||
        (profile.role === "OWNER" && (
          <Stack.Screen
            options={{
              headerRight: () => (
                <View style={{ flexDirection: "row" }}>
                  <Pressable
                    onPress={handleDownloadCsv}
                    style={{ marginRight: 10 }}
                  >
                    <Download color={styles.plusIcon.color} />
                  </Pressable>
                  <Pressable onPress={() => setIsModalVisible(true)}>
                    <Plus color={styles.plusIcon.color} />
                  </Pressable>
                </View>
              ),
            }}
          />
        ))}
      <FlatList
        refreshing={vehiclesAreLoading}
        onRefresh={fetchVehicles}
        contentInsetAdjustmentBehavior="automatic"
        data={filteredVehicles}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Link href={{ pathname: `/vehicles/${item.id}` }} asChild>
            <TouchableOpacity>
              <View style={styles.container}>
                <View style={styles.contentContainer}>
                  <View style={styles.imageContainer}>
                    <VehicleThumbnail vehicleId={item.id} />
                  </View>
                  <Text style={styles.itemText}>
                    <Text
                      style={{ fontWeight: "bold" }}
                    >{`${item.brand} ${item.sub_brand} (${item.year})\n`}</Text>
                    {`Placa: ${item.plate}\n`}
                    {`Número económico: ${item.economic_number}\n`}
                  </Text>
                </View>
                <View style={styles.chevronView}>
                  <ChevronRight color={styles.chevron.color} />
                </View>
              </View>
            </TouchableOpacity>
          </Link>
        )}
      />
      <AddVehicleComponent
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
    color: theme.headerButtons.color,
  },
  chevron: {
    color: theme.textPresets.subtitle,
  },
  chevronView: {
    paddingRight: 12,
  },
}));
