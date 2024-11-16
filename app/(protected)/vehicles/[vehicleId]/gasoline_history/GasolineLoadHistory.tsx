import React from "react";
import { View, Text, FlatList } from "react-native";
import useAllGasolineLoads from "@/hooks/GasolineDataTest/useAllGasolineLoadHistory";
import { useLocalSearchParams } from "expo-router";

export default function GasolineLoadHistory() {
  const { vehicleId } = useLocalSearchParams<{ vehicleId: string }>();
  if (!vehicleId) return <Text>ID de vehículo no encontrado</Text>;
  const { allGasolineLoads, loading } = useAllGasolineLoads(vehicleId);

  if (loading) {
    return <Text>Cargando historial completo...</Text>;
  }

  return (
      <FlatList
        contentInsetAdjustmentBehavior="automatic"
        data={allGasolineLoads}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 10 }}>
            <Text>
              {new Date(item.approved_at).toLocaleDateString()} - ${item.amount.toFixed(2)} MXN
            </Text>
          </View>
        )}
      />
  );
}