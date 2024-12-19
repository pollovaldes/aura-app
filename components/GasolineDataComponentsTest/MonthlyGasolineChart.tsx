import React, { useMemo } from "react";
import { LineChart } from "react-native-chart-kit";
import { Dimensions, Text, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import useMonthlyGasolineData from "@/hooks/GasolineDataTest/useMonthlyGasolineData";

const screenWidth = Dimensions.get("window").width;

const chartConfig = {
  backgroundColor: "#1e88e5",
  backgroundGradientFrom: "#1e88e5",
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

export default function MonthlyGasolineChart({
  vehicleId,
}: {
  vehicleId: string;
}) {
  const { styles } = useStyles(stylesheet);
  const { monthlyData, loading } = useMonthlyGasolineData(vehicleId);

  const chartData = useMemo(() => {
    const sortedData = monthlyData?.slice(-4) || []; // Show last 4 weeks
    const labels = sortedData.map((item) => {
      const date = new Date(item.week_start_date);
      return `Sem ${date.getDate()}/${date.getMonth() + 1}`;
    });
    const data = sortedData.map((item) => item.total_spent || 0);

    return {
      labels,
      datasets: [{ data }],
    };
  }, [monthlyData]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Cargando datos mensuales...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gastos del Mes</Text>
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
}));
