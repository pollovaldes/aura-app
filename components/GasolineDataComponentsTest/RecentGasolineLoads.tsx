import React from "react";
import { View, Text, FlatList } from "react-native";
import useRecentGasolineLoads from "@/hooks/GasolineDataTest/useRecentGasolineLoads";

export default function RecentGasolineLoads({ vehicleId }: { vehicleId: string }) {
  const { gasolineLoads, loading } = useRecentGasolineLoads(vehicleId);

  if (loading) {
    return <Text>Cargando últimas cargas...</Text>;
  }

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>Últimas Cargas</Text>
      <FlatList
        data={gasolineLoads}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 10 }}>
            <Text>
              {new Date(item.approved_at).toLocaleDateString()} - ${item.amount.toFixed(2)} MXN
            </Text>
          </View>
        )}
      />
    </View>
  );
}