import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const useWeeklyGasolineData = (vehicleId: string) => {
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeeklyData = async () => {
      const { data, error } = await supabase
        .from("gasoline_spent_per_week")
        .select("*")
        .eq("vehicle_id", vehicleId)
        .order("week_start_date", { ascending: true });

      if (error) {
        console.error("Error fetching weekly data:", error);
      } else {
        setWeeklyData(data);
      }
      setLoading(false);
    };

    fetchWeeklyData();
  }, [vehicleId]);

  return { weeklyData, loading };
};

export default useWeeklyGasolineData;