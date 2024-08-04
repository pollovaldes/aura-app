import { View, Text, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase"; // Asegúrate de tener configurado supabase correctamente

// Define the type for the truck data
type Truck = {
  id: number;
  marca: string;
  modelo: number;
  submarca: string;
  // Agrega otros campos si es necesario
};

export default function TruckDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{id:string}>(); // Specify that id is a string
  const [truck, setTruck] = useState<Truck | null>(null); // Define the type of state
  const [loading, setLoading] = useState(true);

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
    };
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!truck) {
    return (
      <View style={styles.errorContainer}>
        <Text>Truck not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{`${truck.marca} ${truck.submarca}`}</Text>
      <Text style={styles.details}>{`Modelo: ${truck.modelo}`}</Text>
      {/* Agrega más detalles si es necesario */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
  },
  details: {
    fontSize: 18,
  },
});
