import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export interface GasolineStatus {
  remaining_gasoline: number;
  gasoline_threshold: number;
  spent_gasoline: number;
  last_reset_date: string;
}

export default function useGasolineStatus(vehicleId: string | undefined) {
  const [gasolineStatus, setGasolineStatus] = useState<GasolineStatus | null>(null);
  const [isGasolineStatusLoading, setIsGasolineStatusLoading] = useState(true);

  const shouldReset = () => {
    const now = new Date();
    // Get the previous Saturday midnight
    const lastSaturday = new Date();
    lastSaturday.setDate(now.getDate() - ((now.getDay() + 1) % 7));
    lastSaturday.setHours(0, 0, 0, 0);
    
    // Get current week's Saturday midnight
    const thisSaturday = new Date(lastSaturday);
    thisSaturday.setDate(lastSaturday.getDate() + 7);
    console.log("lastSaturday", lastSaturday);
    console.log("thisSaturday", thisSaturday);
    console.log("now", now);
    
    // Check if we're in a new week (past Saturday midnight)
    return now >= thisSaturday;
  };

  const resetGasolineIfNeeded = async () => {
    if (!vehicleId || !shouldReset()) return;

    const { error } = await supabase
      .from("vehicle_gasoline_status")
      .update({
        spent_gasoline: 0,
      })
      .eq("vehicle_id", vehicleId);

    if (error) {
      console.error("Error resetting gasoline:", error);
    } else {
      // Fetch updated data
      fetchGasolineStatus();
    }
  };

  const fetchGasolineStatus = async () => {
    if (!vehicleId) return;

    setIsGasolineStatusLoading(true);
    const { data, error } = await supabase
      .from("vehicle_gasoline_status")
      .select("*")
      .eq("vehicle_id", vehicleId)
      .single();

    if (error) {
      console.error("Error fetching gasoline status:", error);
    } else {
      await resetGasolineIfNeeded();
      setGasolineStatus(data);
    }
    setIsGasolineStatusLoading(false);
  };

  useEffect(() => {
    fetchGasolineStatus();
  }, [vehicleId]);

  return { gasolineStatus, isGasolineStatusLoading, fetchGasolineStatus };
}