import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface AllGasolineLoads {
  id: string;
  vehicle_id: string;
  status: string;
  requested_at: string;
  amount: number;
  liters: number;
  [key: string]: any;
}

const useAllGasolineLoads = (vehicleId: string) => {
  const [allGasolineLoads, setAllGasolineLoads] = useState<AllGasolineLoads[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      .order("requested_at", { ascending: false });

    if (error) {
      setError("Error fetching all gasoline loads");
      console.error("Error fetching all gasoline loads:", error);
    } else {
      setAllGasolineLoads(data);
      setError(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAllGasolineLoads();
  }, [vehicleId]);

  return { allGasolineLoads, loading, error, refetch: fetchAllGasolineLoads };
};

export default useAllGasolineLoads;
