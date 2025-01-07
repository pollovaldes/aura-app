import FormTitle from "@/app/auth/FormTitle";
import { FormButton } from "@/components/Form/FormButton";
import { ActivityIndicator, FlatList, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { useCreateRoute } from "./CreateRouteContext";
import { BackButtonOverlay } from "./BackButtonOverlay";
import { useFleets } from "@/hooks/useFleets";
import React, { useEffect, useState } from "react";
import EmptyScreen from "@/components/dataStates/EmptyScreen";
import { Vehicle } from "@/types/globalTypes";
import { SimpleList } from "@/components/simpleList/SimpleList";
import { VehicleThumbnail } from "@/components/vehicles/VehicleThumbnail";
import { RadioButton } from "@/components/radioButton/RadioButton";

export function VehicleStep() {
  const { styles } = useStyles(stylesheet);
  const { setStep, setField, routeData } = useCreateRoute();
  const { areFleetsLoading, fetchFleets, fleets } = useFleets();
  const [vehicles, setVehicles] = useState<Vehicle[] | null>(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(routeData.vehicle_id ?? null);

  useEffect(() => {
    console.log("Vehicles updated:", vehicles);
  }, [vehicles]);

  useEffect(() => {
    if (fleets && fleets.length > 0) {
      const vehicleArray: Vehicle[] = [];
      fleets.forEach((fleet) => {
        if (fleet.vehicles && fleet.vehicles.length > 0) {
          vehicleArray.push(...fleet.vehicles);
        }
      });
      setVehicles(vehicleArray);
    } else {
      setVehicles([]);
    }
  }, [fleets]);

  function handleVehicleSelect(vehicleId: string) {
    setSelectedVehicleId(vehicleId);
    const selectedVehicle = vehicles?.find((v) => v.id === vehicleId);
    if (selectedVehicle) {
      setField("vehicle_id", selectedVehicle.id);
    }
  }

  function FleetLoadingComponent() {
    return (
      <View style={[styles.group, { paddingVertical: 40 }]}>
        <FormTitle title="Obteniendo vehículos" />
        <ActivityIndicator />
      </View>
    );
  }

  function FleetError() {
    return (
      <View style={[styles.group, { paddingVertical: 40 }]}>
        <FormTitle title="No pudimos obtener las flotillas" />
        <FormButton title="Reintentar" onPress={fetchFleets} />
      </View>
    );
  }

  function FleetList() {
    return (
      <>
        <View style={styles.group}>
          <FormTitle title="¿Con qué vehículo harás la ruta?" />
          <Text style={styles.subtitle}>Elige un vehículo de tus flotillas</Text>
        </View>
        <ScrollView horizontal scrollEnabled={false} contentContainerStyle={{ width: "100%" }}>
          <FlatList
            data={vehicles}
            refreshing={areFleetsLoading}
            onRefresh={fetchFleets}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <SimpleList
                relativeToDirectory
                leading={<VehicleThumbnail vehicleId={item.id} />}
                content={
                  <TouchableOpacity onPress={() => handleVehicleSelect(item.id)}>
                    <Text style={styles.itemTitle}>
                      {`${item.brand ?? "N/A"} ${item.sub_brand ?? "N/A"} (${item.year ?? "N/A"})`}
                    </Text>
                    <Text style={styles.itemDetails}>
                      {`Placa: ${item.plate ?? "N/A"}\nNúmero económico: ${
                        item.economic_number ?? "N/A"
                      }\nNúmero de serie: ${item.serial_number ?? "N/A"}`}
                    </Text>
                  </TouchableOpacity>
                }
                trailing={
                  <RadioButton selected={selectedVehicleId === item.id} onPress={() => handleVehicleSelect(item.id)} />
                }
                hideChevron
              />
            )}
            ListEmptyComponent={<EmptyScreen caption="Ningún vehículo por aquí." />}
            nestedScrollEnabled
          />
        </ScrollView>
        <View style={styles.group}>
          <FormButton title="Continuar" onPress={() => setStep(4)} isDisabled={!selectedVehicleId} />
        </View>
      </>
    );
  }

  return (
    <View style={styles.section}>
      <BackButtonOverlay back={() => setStep(2)} />
      {areFleetsLoading ? <FleetLoadingComponent /> : !fleets ? <FleetError /> : <FleetList />}
    </View>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  section: {
    gap: theme.marginsComponents.section,
  },
  group: {
    gap: theme.marginsComponents.group,
  },
  subtitle: {
    color: theme.textPresets.subtitle,
    textAlign: "center",
  },
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
