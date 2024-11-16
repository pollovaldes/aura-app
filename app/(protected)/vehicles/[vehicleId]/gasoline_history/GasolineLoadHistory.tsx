import { Stack } from "expo-router";
import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Modal } from "react-native";
import { Filter, Truck } from "lucide-react-native";
import useAllGasolineLoads from "@/hooks/GasolineDataTest/useAllGasolineLoadHistory";
import { useLocalSearchParams } from "expo-router";
import { createStyleSheet, useStyles } from "react-native-unistyles";

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
  const [filterVisible, setFilterVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');

  if (!vehicleId) return <Text style={styles.errorText}>ID de vehículo no encontrado</Text>;
  
  const { allGasolineLoads, loading } = useAllGasolineLoads(vehicleId);

  const filterData = (data: GasolineLoad[]) => {
    const now = new Date();
    switch (activeFilter) {
      case 'week':
        const weekAgo = new Date(now.setDate(now.getDate() - 7));
        return data.filter(item => new Date(item.requested_at) > weekAgo);
      case 'month':
        const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
        return data.filter(item => new Date(item.requested_at) > monthAgo);
      case 'amount_asc':
        return [...data].sort((a, b) => a.amount - b.amount);
      case 'amount_desc':
        return [...data].sort((a, b) => b.amount - a.amount);
      default:
        return data;
    }
  };

  const filteredData = filterData(allGasolineLoads || []);

  if (loading) {
    return <Text style={styles.loadingText}>Cargando historial completo...</Text>;
  }

  const FilterMenu = () => (
    <Modal
      visible={filterVisible}
      transparent
      animationType="fade"
      onRequestClose={() => setFilterVisible(false)}
    >
      <TouchableOpacity 
        style={styles.modalOverlay} 
        onPress={() => setFilterVisible(false)}
      >
        <View style={styles.modalContent}>
          <FilterOption title="Todos" onPress={() => { setActiveFilter('all'); setFilterVisible(false); }} />
          <FilterOption title="Última semana" onPress={() => { setActiveFilter('week'); setFilterVisible(false); }} />
          <FilterOption title="Último mes" onPress={() => { setActiveFilter('month'); setFilterVisible(false); }} />
          <FilterOption title="Monto ↑" onPress={() => { setActiveFilter('amount_asc'); setFilterVisible(false); }} />
          <FilterOption title="Monto ↓" onPress={() => { setActiveFilter('amount_desc'); setFilterVisible(false); }} />
        </View>
      </TouchableOpacity>
    </Modal>
  );

  const FilterOption = ({ title, onPress }: { title: string; onPress: () => void }) => (
    <TouchableOpacity style={styles.filterOption} onPress={onPress}>
      <Text style={styles.filterOptionText}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <>
      <Stack.Screen 
        options={{
          title: "Historial de Cargas",
          headerRight: () => (
            <TouchableOpacity 
              style={styles.filterButton}
              onPress={() => setFilterVisible(true)}
            >
              <Filter size={20} color="white" />
            </TouchableOpacity>
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
        <FilterMenu />
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    width: '80%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  filterOption: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  filterOptionText: {
    fontSize: 16,
    color: '#333',
  },
}));