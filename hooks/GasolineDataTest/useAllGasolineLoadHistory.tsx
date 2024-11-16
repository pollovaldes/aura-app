import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface AllGasolineLoads {
  id: string;
  vehicle_id: string;
  status: string;
  approved_at: string;
  [key: string]: any;
}

const useAllGasolineLoads = (vehicleId: string) => {
  const [allGasolineLoads, setAllGasolineLoads] = useState<AllGasolineLoads[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllGasolineLoads = async () => {

      if (!vehicleId) {
        console.error("Vehicle ID is undefined");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("gasoline_loads")
        .select("*")
        .eq("vehicle_id", vehicleId)
        .eq("status", "approved")
        .order("approved_at", { ascending: false })

      if (error) {
        console.error("Error fetching all gasoline loads:", error);
      } else {
        setAllGasolineLoads(data);
      }
      setLoading(false);
    };

    fetchAllGasolineLoads();
  }, [vehicleId]);

  return { allGasolineLoads, loading };
};

export default useAllGasolineLoads;