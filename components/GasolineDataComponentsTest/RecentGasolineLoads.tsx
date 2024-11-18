import React from "react";
import { View, Text, FlatList } from "react-native";
import useRecentGasolineLoads from "@/hooks/GasolineDataTest/useRecentGasolineLoads";
import { createStyleSheet, useStyles } from "react-native-unistyles";

export default function RecentGasolineLoads({ vehicleId }: { vehicleId: string }) {
  const { styles } = useStyles(stylesheet);
  const { gasolineLoads, loading } = useRecentGasolineLoads(vehicleId);

  if (loading) {
    return <Text style={styles.loadingText}>Cargando últimas cargas...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Últimas Cargas</Text>
      <FlatList
        data={gasolineLoads}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View>
              <Text style={styles.amount}>${item.amount.toFixed(2)} MXN</Text>
              <Text style={styles.liters}>{item.liters.toFixed(2)} L</Text>
            </View>
            <Text style={styles.date}>
              {new Date(item.approved_at).toLocaleDateString('es-MX', {
                weekday: 'short',
                day: 'numeric',
                month: 'short'
              })}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  container: {
    width: '95%',
    padding: 25,
    backgroundColor: theme.ui.colors.card,
    borderRadius: 16,
    marginVertical: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: theme.headerButtons.color,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.ui.colors.background,
    padding: 15,
    borderRadius: 12,
    marginBottom: 8,
  },
  amount: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.headerButtons.color,
  },
  date: {
    fontSize: 14,
    color: theme.textPresets.subtitle,
  },
  loadingText: {
    fontSize: 16,
    color: theme.textPresets.subtitle,
    textAlign: 'center',
    padding: 20,
  },
  liters: {
    fontSize: 14,
    color: theme.textPresets.subtitle,
    marginTop: 4,
  },
}));