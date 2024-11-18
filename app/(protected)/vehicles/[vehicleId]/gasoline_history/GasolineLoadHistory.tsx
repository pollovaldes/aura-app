import { Stack, useLocalSearchParams } from "expo-router";
import React, { useState, useMemo } from "react";
import { View, Text, FlatList, RefreshControl, Alert, Platform } from "react-native";
import useAllGasolineLoads from "@/hooks/GasolineDataTest/useAllGasolineLoadHistory";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import LoadingScreen from "@/components/dataStates/LoadingScreen";
import ErrorScreen from "@/components/dataStates/ErrorScreen";
import EmptyScreen from "@/components/dataStates/EmptyScreen";
import { useHeaderHeight } from "@react-navigation/elements";

// Move to types/gasoline.ts
type GasolineLoad = {
  id: string;
  vehicle_id: string;
  status: string;
  requested_at: string;
  amount: number;
  liters: number;
};

// Memoized card component
const GasolineCard = React.memo(({ item }: { item: GasolineLoad }) => {
  const { styles } = useStyles(stylesheet);
  const formattedDate = useMemo(() => 
    new Date(item.requested_at || new Date()).toLocaleDateString('es-MX', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).replace(/^\w/, (c) => c.toUpperCase()),
    [item.requested_at]
  );

  return (
    <View style={styles.card}>
      <View>
        <Text style={styles.amount}>${item.amount.toFixed(2)} MXN</Text>
        <Text style={styles.liters}>{item.liters.toFixed(2)} L</Text>
        <Text style={styles.date}>{formattedDate}</Text>
      </View>
      <View style={[styles.status, { backgroundColor: item.status === 'approved' ? '#e8f5e9' : '#fff3e0' }]}>
        <Text style={[styles.statusText, { color: item.status === 'approved' ? '#2e7d32' : '#ef6c00' }]}>
          {item.status === 'approved' ? 'Aprobado' : 'Pendiente'}
        </Text>
      </View>
    </View>
  );
});

export default function GasolineLoadHistory() {
  const { styles } = useStyles(stylesheet);
  const { vehicleId } = useLocalSearchParams<{ vehicleId: string }>();
  const [currentTabIndex, setCurrentTabIndex] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  
  const { allGasolineLoads, loading, error, refetch } = useAllGasolineLoads(vehicleId);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar el historial");
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  const filteredData = useMemo(() => {
    if (!allGasolineLoads) return [];
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    switch (currentTabIndex) {
      case 1:
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        return allGasolineLoads.filter(item => new Date(item.requested_at) >= weekAgo);
      case 2:
        const monthAgo = new Date(today.getTime());
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return allGasolineLoads.filter(item => new Date(item.requested_at) >= monthAgo);
      default:
        return allGasolineLoads;
    }
  }, [allGasolineLoads, currentTabIndex]);

  if (!vehicleId) {
    return (
      <>
        <Stack.Screen options={{ title: "Error" }} />
        <ErrorScreen
          caption="ID de vehículo no encontrado"
          buttonCaption="Regresar"
          retryFunction={onRefresh}
        />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Stack.Screen options={{ title: "Error" }} />
        <ErrorScreen
          caption="Error al cargar el historial de gasolina"
          buttonCaption="Reintentar"
          retryFunction={onRefresh}
        />
      </>
    );
  }

  if (loading) {
    return (
      <>
        <Stack.Screen options={{ title: "Cargando..." }} />
        <LoadingScreen caption="Cargando historial de gasolina" />
      </>
    );
  }

  return (
    <>
      <Stack.Screen 
        options={{
          title: "Historial de Cargas",
          headerLargeTitle: false,
          headerTitle: () => (
            <SegmentedControl
              values={["Todos", "Última semana", "Último mes"]}
              selectedIndex={currentTabIndex}
              onChange={(event) => setCurrentTabIndex(event.nativeEvent.selectedSegmentIndex)}
              style={styles.segmentedControl}
            />
          ),
        }} 
      />
      <View style={styles.safeContainer}>
        <FlatList
          contentInsetAdjustmentBehavior="automatic"
          data={filteredData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <GasolineCard item={item} />}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#1976d2"]}
              tintColor="#1976d2"
            />
          }
          ListEmptyComponent={() => (
            <View style={{ height: 250 }}>
              <EmptyScreen caption="No hay registros de gasolina con este filtro" />
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
    backgroundColor: theme.ui.colors.background,
  },
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: theme.ui.colors.background,
  },
  card: {
    backgroundColor: theme.ui.colors.card,
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.headerButtons.color,
  },
  date: {
    fontSize: 14,
    color: theme.textPresets.subtitle,
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
    color: theme.textPresets.subtitle,
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
    color: theme.headerButtons.color,
  },
  filterButton: {
    backgroundColor: theme.headerButtons.color,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: -8,
  },
  filterButtonText: {
    color: theme.textPresets.main,
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
    color: theme.textPresets.subtitle,
    marginTop: 4,
  },
}));