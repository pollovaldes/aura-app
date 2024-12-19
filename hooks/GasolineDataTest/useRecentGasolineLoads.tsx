import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface GasolineLoad {
  id: string;
  vehicle_id: string;
  status: string;
  approved_at: string;
  [key: string]: any;
}

const useRecentGasolineLoads = (vehicleId: string) => {
  const [gasolineLoads, setGasolineLoads] = useState<GasolineLoad[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGasolineLoads = async () => {
      const { data, error } = await supabase
        .from("gasoline_loads")
        .select("*")
        .eq("vehicle_id", vehicleId)
        .eq("status", "approved")
        .order("approved_at", { ascending: false })
        .limit(5);

      if (error) {
        console.error("Error fetching gasoline loads:", error);
      } else {
        setGasolineLoads(data);
      }
      setLoading(false);
    };

    fetchGasolineLoads();
  }, [vehicleId]);

  return { gasolineLoads, loading };
};

export default useRecentGasolineLoads;
