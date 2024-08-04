import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter, useLocalSearchParams, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase"; // Asegúrate de tener configurado supabase correctamente
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { createStyleSheet, useStyles } from "react-native-unistyles";

// Define the type for the truck data
type Truck = {
  id: number;
  marca: string;
  modelo: number;
  submarca: string;
  // Agrega otros campos si es necesario
};

export default function TruckDetail() {
  const { id } = useLocalSearchParams<{ id: string }>(); // Specify that id is a string
  const [truck, setTruck] = useState<Truck | null>(null); // Define the type of state
  const [loading, setLoading] = useState(true);

  const { styles } = useStyles(stylesheet);

  useEffect(() => {
    if (id) {
      fetchTruckData();
      console.log("Fetching truck data...", id, parseInt(id));
    }
  }, []);

  const fetchTruckData = async () => {
    if (id) {
      try {
        const { data, error } = await supabase
          .from("Trucks")
          .select("*")
          .eq("id", parseInt(id)) // Ensure id is converted to number
          .single();

        if (error) throw error;

        setTruck(data);
      } catch (error) {
        console.error("Error fetching truck data:", error);
      } finally {
        setLoading(false);
      }
    }
  };

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
