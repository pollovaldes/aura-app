import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter, useLocalSearchParams, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase"; // Asegúrate de tener configurado supabase correctamente
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { createStyleSheet, useStyles } from "react-native-unistyles";

// Define the type for the truck data
type Truck = {
  truckId: number;
  marca: string;
  modelo: number;
  submarca: string;
  // Agrega otros campos si es necesario
};

type Props = {
  truck: Truck | null;
  loading: boolean;
};

export default function TruckDetailComponent({ truck, loading }: Props) {
  const { styles } = useStyles(stylesheet);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator />
        <Stack.Screen options={{ title: "" }} />
      </View>
    );
  }

  if (!truck) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.details}>Este camión no existe…</Text>
        <Stack.Screen options={{ title: "Error" }} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: `${truck.marca} ${truck.submarca}` }} />
      <Text style={styles.title}>{`${truck.marca} ${truck.submarca}`}</Text>
      <Text style={styles.details}>{`Modelo: ${truck.modelo}`}</Text>
      {/* Agrega más detalles si es necesario */}
    </View>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: theme.textPresets.main,
  },
  details: {
    fontSize: 18,
    color: theme.textPresets.main,
  },
}));
