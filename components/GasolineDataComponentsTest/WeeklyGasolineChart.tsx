import React from "react";
import { LineChart } from "react-native-chart-kit";
import { Dimensions, Text, View } from "react-native";
import useWeeklyGasolineData from "@/hooks/GasolineDataTest/useWeeklyGasolineData";
import { createStyleSheet, useStyles } from "react-native-unistyles";

const screenWidth = Dimensions.get("window").width;

const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

export default function WeeklyGasolineChart({ vehicleId }: { vehicleId: string }) {
  const { styles } = useStyles(stylesheet);
  const { weeklyData, loading } = useWeeklyGasolineData(vehicleId);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Cargando datos semanales...</Text>
      </View>
    );
  }

  // Create an array for all days of the week with 0 as default value
  const allDays = new Array(7).fill(0);
  
  // Fill in the actual values
  weeklyData.forEach((item) => {
    const date = new Date(item.day_date);
    const dayIndex = date.getDay();
    allDays[dayIndex] = item.total_spent;
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gastos de la Semana</Text>
      <LineChart
        data={{
          labels: dayNames,
          datasets: [{ data: allDays }],
        }}
        width={screenWidth * 0.9}
        height={220}
        yAxisSuffix=" MXN"
        chartConfig={{
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
            stroke: "#fafafa"
          }
        }}
        yLabelsOffset={-10}
        bezier
        style={styles.chart}
      />
    </View>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  container: {
    alignItems: 'center',
    width: '95%',
    padding: 25,
    backgroundColor: '#fff',
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
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#1e88e5',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  }
}));