import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import TruckDetailComponent from "./TruckDetailComponent";

type Truck = {
  truckId: number;
  marca: string;
  modelo: number;
  submarca: string;
  // Agrega otros campos si es necesario
};

export default function TruckDetailContainer() {
  const { truckId } = useLocalSearchParams<{ truckId: string }>(); // Specify that id is a string
  const [truck, setTruck] = useState<Truck | null>(null); // Define the type of state
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (truckId) {
      fetchTruckData();
      console.log("Fetching truck data...", truckId, parseInt(truckId));
    }
  }, [truckId]);

  const fetchTruckData = async () => {
    if (truckId) {
      try {
        const { data, error } = await supabase
          .from("Trucks")
          .select("*")
          .eq("id", parseInt(truckId)) // Ensure id is converted to number
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

  return <TruckDetailComponent truck={truck} loading={loading} />;
};