import React from "react";
import { LineChart } from "react-native-chart-kit";
import { Dimensions, View, Text } from "react-native";
import useWeeklyGasolineData from "@/hooks/GasolineDataTest/useWeeklyGasolineData";

const screenWidth = Dimensions.get("window").width;

export default function WeeklyGasolineChart({ vehicleId }: { vehicleId: string }) {
  const { weeklyData, loading } = useWeeklyGasolineData(vehicleId);

  if (loading) {
    return <Text>Cargando datos semanales...</Text>;
  }

  const labels = weeklyData.map((item) =>
    new Date(item.week_start_date).toLocaleDateString()
  );
  const data = weeklyData.map((item) => item.total_spent);

  return (
    <View>
      <LineChart
        data={{
          labels: labels,
          datasets: [{ data: data }],
        }}
        width={screenWidth - 40}
        height={220}
        chartConfig={{
          backgroundColor: "#e26a00",
          backgroundGradientFrom: "#fb8c00",
          backgroundGradientTo: "#ffa726",
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        }}
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />
    </View>
  );
}