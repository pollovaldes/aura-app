import React, { useMemo } from "react";
import { LineChart } from "react-native-chart-kit";
import { Dimensions, Text, View } from "react-native";
import useWeeklyGasolineData from "@/hooks/GasolineDataTest/useWeeklyGasolineData";
import { createStyleSheet, useStyles } from "react-native-unistyles";

const screenWidth = Dimensions.get("window").width;
const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

const chartConfig = {
  backgroundColor: "#1e88e5", // Changed from "#1e88e5"
  backgroundGradientFrom: "#1e88e5", // Changed from "#1e88e5"
  backgroundGradientTo: "#64b5f6",
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  style: {
    borderRadius: 16,
  },
  propsForDots: {
    r: "6",
    strokeWidth: "2",
    stroke: "#fafafa",
  },
};

export default function WeeklyGasolineChart({
  vehicleId,
}: {
  vehicleId: string;
}) {
  const { styles } = useStyles(stylesheet);
  const { weeklyData, loading } = useWeeklyGasolineData(vehicleId);

  const chartData = useMemo(() => {
    const allDays = new Array(7).fill(0);
    weeklyData?.forEach((item) => {
      const dayIndex = new Date(item.day_date).getDay();
      allDays[dayIndex] = item.total_spent;
    });
    return {
      labels: dayNames,
      datasets: [{ data: allDays }],
    };
  }, [weeklyData]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Cargando datos semanales...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gastos de la Semana</Text>
      <LineChart
        data={chartData}
        width={screenWidth * 0.9}
        height={220}
        yAxisSuffix=" MXN"
        chartConfig={chartConfig}
        bezier
        yLabelsOffset={-10}
        style={styles.chart}
      />
    </View>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  container: {
    alignItems: "center",
    width: "95%",
    padding: 25,
    backgroundColor: theme.ui.colors.card,
    borderRadius: 16,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: theme.headerButtons.color,
  },
  loadingText: {
    fontSize: 16,
    color: theme.textPresets.subtitle,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  backgroundColors: {
    backgroundColor: theme.headerButtons.color,
  },
}));
