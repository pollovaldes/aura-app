import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

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

export function useTruckDetail() {
  const { vehicleId } = useLocalSearchParams<{ vehicleId: string }>();
  const [truck, setTruck] = useState<Truck | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTruckData = async () => {
      if (vehicleId) {
        try {
          const { data, error } = await supabase
            .from("camiones")
            .select("*")
            .eq("id", vehicleId)
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

    fetchTruckData();
  }, [vehicleId]);

  return { truck, loading };
}
