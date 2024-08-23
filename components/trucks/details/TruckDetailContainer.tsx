import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import TruckDetailComponent from "./TruckDetailComponent";

type Truck = {
  id: string;
  numero_economico: string;
  marca: string;
  sub_marca: string;
  modelo: string;
  no_serie: string;
  placa: string;
  poliza: string;
};

export default function TruckDetailContainer() {
  const { truckId } = useLocalSearchParams<{ truckId: string }>(); // Specify that id is a string
  const [truck, setTruck] = useState<Truck>(); // Define the type of state
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
          .from("camiones")
          .select("*")
          .eq("id", truckId) // Ensure id is converted to number
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

  if (truck) {
  return <TruckDetailComponent truck={truck} loading={loading} />;
  }
}
