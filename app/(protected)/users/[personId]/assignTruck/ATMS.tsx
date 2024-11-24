import {
  View,
  Text,
  FlatList,
  Pressable,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { Circle, CheckCircle } from "lucide-react-native";
import useVehicle from "@/hooks/truckHooks/useVehicle";
import React, { useEffect, useState } from "react";
import { useSearch } from "@/context/SearchContext";
import useAssignVehicle from "@/hooks/peopleHooks/useAssignVehicle";
import TruckThumbnail from "@/components/vehicles/TruckThumbnail";

export default function AssignVehicleModalScreen() {
  const router = useRouter();

  const { styles } = useStyles(stylesheet);
  const { vehicles, vehiclesAreLoading } = useVehicle();
  const [selectedVehicles, setSelectedVehicles] = useState<Set<string>>(
    new Set()
  ); // Estado para manejar los camiones seleccionados
  const { personId } = useLocalSearchParams<{ personId: string }>();

  const { loading: assignLoading, assignVehicle } = useAssignVehicle({
    user_id: personId,
  }); // Crea un hook para asignar camiones

  const { searchState } = useSearch(); // Get the search state from the context
  const searchQuery = searchState["ATMS"] || ""; // Use the search query for "ATMS"
  const [filteredVehicles, setFilteredVehicles] = useState(vehicles);

  const capitalizeWords = (text: string | null | undefined): string => {
    if (!text) return ""; // Verifica si el texto es nulo, indefinido o vacío
    return text
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const toggleVehicleSelection = (id: string) => {
    const updatedSelection = new Set(selectedVehicles);
    if (updatedSelection.has(id)) {
      updatedSelection.delete(id); // Deselecciona el camión si ya está seleccionado
    } else {
      updatedSelection.add(id); // Selecciona el camión
    }

    setSelectedVehicles(updatedSelection);
  };

  const handleAssign = async () => {
    if (selectedVehicles.size === 0) {
      Alert.alert("Error", "Por favor, selecciona al menos un camión.");
      return;
    }

    const camionesSeleccionados = Array.from(selectedVehicles);
    await assignVehicle(camionesSeleccionados);

    if (vehicles) {
    const camionesDetalles = vehicles.filter((truck) =>
      camionesSeleccionados.includes(truck.id)
    );

    // Crear un texto con la información de todos los camiones seleccionados
    const detallesCamiones = camionesDetalles
      .map(
        (vehicle) =>
          `Camión ${vehicle.economic_number} ${vehicle.brand} ${vehicle.sub_brand} (${vehicle.year})`
      )
      .join(",\n");
    }
    router.back();
  };

  useEffect(() => {
    // Filter vehicles based on the search query
    if (searchQuery && vehicles) {
      const filtered = vehicles.filter((vehicle) =>
        `${vehicle.economic_number} ${vehicle.brand} ${vehicle.sub_brand} (${vehicle.year})`
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
      setFilteredVehicles(filtered);
    } else {
      setFilteredVehicles(vehicles);
    }
  }, [searchQuery, vehicles]);

  if (assignLoading || vehiclesAreLoading) {
    console.log("Loading...");
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={styles.modalContainer}>
      <Stack.Screen
        options={{
          headerLeft: () => (
            <Pressable
              onPress={() => router.back()}
              style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}
            >
              <View style={styles.closeButtonContainer}>
                <Text style={styles.closeButton}>Cancelar</Text>
              </View>
            </Pressable>
          ),
          headerRight: () => (
            <Pressable
              onPress={handleAssign}
              disabled={assignLoading}
              style={({ pressed }) => [
                { opacity: assignLoading ? 0.5 : pressed ? 0.7 : 1 },
              ]}
            >
              <View style={styles.closeButtonContainer}>
                <Text style={styles.closeButton}>Asignar</Text>
              </View>
            </Pressable>
          ),
        }}
      />
      <Text style={styles.closeButton} onPress={() => router.back()}>
        Cerrar
      </Text>
      <View style={styles.section}>
        <View style={styles.group}>
          <FlatList
            contentInsetAdjustmentBehavior="automatic"
            data={filteredVehicles}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => {
              const isSelected = selectedVehicles.has(item.id);
              return (
                <Pressable onPress={() => toggleVehicleSelection(item.id)}>
                  <View
                    style={[
                      styles.container,
                      isSelected ? styles.selectedItem : null,
                    ]}
                  >
                    <View style={styles.contentContainer}>
                      <View style={styles.imageContainer}>
                        <TruckThumbnail vehicleId={item.id} />
                      </View>
                      <Text style={styles.itemText}>
                        <Text style={{ fontWeight: "bold" }}>
                          {item.economic_number}
                        </Text>
                        {`\n${capitalizeWords(item.brand)} ${capitalizeWords(item.sub_brand)} (${(item.year)})`}
                      </Text>
                    </View>
                    <View style={styles.chevronView}>
                      {isSelected ? (
                        <CheckCircle color={styles.chevron.color} />
                      ) : (
                        <Circle color={styles.chevron.color} />
                      )}
                    </View>
                  </View>
                </Pressable>
              );
            }}
          />
        </View>
      </View>
    </View>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  modalContainer: {
    backgroundColor: theme.ui.colors.card,
    borderRadius: 10,
    padding: 24,
    flex: 1,
  },
  closeButton: {
    color: theme.headerButtons.color,
    fontSize: 18,
    textAlign: "right",
  },
  section: {
    gap: theme.marginsComponents.section,
    alignItems: "center",
  },
  group: {
    gap: theme.marginsComponents.group,
    width: "100%",
    marginBottom: 20,
  },
  subtitle: {
    color: theme.textPresets.main,
    textAlign: "center",
  },
  container: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: theme.ui.colors.border,
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  selectedItem: {
    backgroundColor: "#cce5ff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
    width: 50,
    height: 50,
  },
  itemText: {
    fontSize: 18,
    paddingLeft: 10,
    color: theme.textPresets.main,
    flexShrink: 1,
    marginRight: 18,
  },
  chevron: {
    color: theme.textPresets.subtitle,
  },
  chevronView: {
    paddingRight: 12,
  },
  closeButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
}));
