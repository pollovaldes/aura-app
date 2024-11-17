import { Stack } from "expo-router";
import React, { useState } from "react";
import { View, Text, FlatList } from "react-native";
import useAllGasolineLoads from "@/hooks/GasolineDataTest/useAllGasolineLoadHistory";
import { useLocalSearchParams } from "expo-router";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import SegmentedControl from "@react-native-segmented-control/segmented-control";

interface GasolineLoad {
  id: string;
  vehicle_id: string;
  status: string;
  requested_at: string;
  [key: string]: any;
}

export default function GasolineLoadHistory() {
  const { styles } = useStyles(stylesheet);
  const { vehicleId } = useLocalSearchParams<{ vehicleId: string }>();
  const [currentTabIndex, setCurrentTabIndex] = useState(0);

  if (!vehicleId) return <Text style={styles.errorText}>ID de vehículo no encontrado</Text>;
  
  const { allGasolineLoads, loading } = useAllGasolineLoads(vehicleId);

  const filterData = (data: GasolineLoad[]) => {
    const now = new Date();
    switch (currentTabIndex) {
      case 1: // Last week
        const weekAgo = new Date(now.setDate(now.getDate() - 7));
        return data.filter(item => new Date(item.requested_at) > weekAgo);
      case 2: // Last month
        const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
        return data.filter(item => new Date(item.requested_at) > monthAgo);
      default: // All
        return data;
    }
  };

  const filteredData = filterData(allGasolineLoads || []);

  if (loading) {
    return <Text style={styles.loadingText}>Cargando historial completo...</Text>;
  }

  return (
    <>
      <Stack.Screen 
        options={{
          title: "Historial de Cargas",
          headerRight: undefined,
          headerLargeTitle: false,
          headerTitle: () => (
            <View>
              <SegmentedControl
                values={["Todos", "Última semana", "Último mes"]}
                selectedIndex={currentTabIndex}
                onChange={(event) => {
                  setCurrentTabIndex(event.nativeEvent.selectedSegmentIndex);
                }}
                style={styles.segmentedControl}
              />
            </View>
          ),
        }} 
      />
      <View style={styles.safeContainer}>
        <FlatList
          contentInsetAdjustmentBehavior="automatic"
          data={filteredData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View>
                <Text style={styles.amount}>${item.amount.toFixed(2)} MXN</Text>
                <Text style={styles.liters}>{item.liters.toFixed(2)} L</Text>
                <Text style={styles.date}>
                  {new Date(item.requested_at || new Date()).toLocaleDateString('es-MX', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }).replace(/^\w/, (c) => c.toUpperCase())}
                </Text>
              </View>
              <View style={[styles.status, { backgroundColor: item.status === 'approved' ? '#e8f5e9' : '#fff3e0' }]}>
                <Text style={[styles.statusText, { color: item.status === 'approved' ? '#2e7d32' : '#ef6c00' }]}>
                  {item.status === 'approved' ? 'Aprobado' : 'Pendiente'}
                </Text>
              </View>
            </View>
          )}
        />
      </View>
    </>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  safeContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f5f5f5',
  },
  card: {
    
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1976d2',
  },
  date: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  status: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
    textAlign: 'center',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1976d2',
  },
  filterButton: {
    backgroundColor: '#1976d2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: -8,
  },
  filterButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  segmentedControl: {
    width: 350,
  },
  liters: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
}));