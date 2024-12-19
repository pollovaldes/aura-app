import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const useMonthlyGasolineData = (vehicleId: string) => {
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMonthlyData = async () => {
      const { data, error } = await supabase
        .from("gasoline_spent_per_week")
        .select("*")
        .eq("vehicle_id", vehicleId)
        .order("week_start_date", { ascending: true });

      if (error) {
        console.error("Error fetching monthly data:", error);
      } else {
        setMonthlyData(data);
      }
      setLoading(false);
    };

    fetchMonthlyData();
  }, [vehicleId]);

  return { monthlyData, loading };
};

export default useMonthlyGasolineData;
