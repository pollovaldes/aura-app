import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface DailyGasolineData {
  day_date: string;
  total_spent: number;
  vehicle_id: string;
}

const useWeeklyGasolineData = (vehicleId: string) => {
  const [weeklyData, setWeeklyData] = useState<DailyGasolineData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeeklyData = async () => {
      // Get current week's start and end dates
      const now = new Date();
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      startOfWeek.setHours(0, 0, 0, 0);

      const endOfWeek = new Date(now);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);

      const { data, error } = await supabase
        .from("gasoline_spent_per_day")
        .select("*")
        .eq("vehicle_id", vehicleId)
        .gte("day_date", startOfWeek.toISOString())
        .lte("day_date", endOfWeek.toISOString())
        .order("day_date", { ascending: true });

      if (error) {
        console.error("Error fetching daily data:", error);
        setWeeklyData([]);
      } else {
        setWeeklyData(data || []);
      }
      setLoading(false);
    };

    if (vehicleId) {
      fetchWeeklyData();
    }
  }, [vehicleId]);

  return { weeklyData, loading };
};

export default useWeeklyGasolineData;