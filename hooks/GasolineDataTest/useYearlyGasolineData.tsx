//Posiblemente Borrrar

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const useYearlyGasolineData = (vehicleId: string) => {
  const [yearlyData, setYearlyData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchYearlyData = async () => {
      const { data, error } = await supabase
        .from("gasoline_spent_per_year")
        .select("*")
        .eq("vehicle_id", vehicleId)
        .order("year_start_date", { ascending: true });

      if (error) {
        console.error("Error fetching yearly data:", error);
      } else {
        setYearlyData(data);
      }
      setLoading(false);
    };

    fetchYearlyData();
  }, [vehicleId]);

  return { yearlyData, loading };
};

export default useYearlyGasolineData;
