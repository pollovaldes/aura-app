import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export interface GasolineStatus {
  remaining_gasoline: number;
  gasoline_threshold: number;
  spent_gasoline: number;
  spent_liters: number;
  liters_threshold: number;
  last_reset_date: string;
}

export default function useGasolineStatus(vehicleId: string | undefined) {
  const [gasolineStatus, setGasolineStatus] = useState<GasolineStatus | null>(null);
  const [isGasolineStatusLoading, setIsGasolineStatusLoading] = useState(true);

  const shouldReset = (lastResetDate: string) => {
    const now = new Date();
    const lastReset = new Date(lastResetDate);
    
    // Find the next Saturday midnight after the last reset
    const nextResetDate = new Date(lastReset);
    nextResetDate.setDate(lastReset.getDate() + ((6 - lastReset.getDay() + 7) % 7));
    nextResetDate.setHours(0, 0, 0, 0);

    // If we've passed the next reset date, we should reset
    return now >= nextResetDate;
  };

  const resetGasolineIfNeeded = async (currentStatus: GasolineStatus) => {
    if (!vehicleId) return;

    if (shouldReset(currentStatus.last_reset_date)) {
      console.log("Resetting gasoline status...");
      const now = new Date();
      
      const { error } = await supabase
        .from("vehicle_gasoline_status")
        .update({
          spent_gasoline: 0,
          spent_liters: 0,
          last_reset_date: now.toISOString()
        })
        .eq("vehicle_id", vehicleId);

      if (error) {
        console.error("Error resetting gasoline:", error);
      } else {
        // Fetch updated data after reset
        fetchGasolineStatus();
      }
    }
  };

  const fetchGasolineStatus = async () => {
    if (!vehicleId) return;

    setIsGasolineStatusLoading(true);
    try {
      const { data, error } = await supabase
        .from("vehicle_gasoline_status")
        .select("*")
        .eq("vehicle_id", vehicleId)
        .single();

      if (error) {
        console.error("Error fetching gasoline status:", error);
        return;
      }

      if (data) {
        await resetGasolineIfNeeded(data);
        setGasolineStatus(data);
      }
    } catch (error) {
      console.error("Error in gasoline status operation:", error);
    } finally {
      setIsGasolineStatusLoading(false);
    }
  };

  useEffect(() => {
    fetchGasolineStatus();
    
    // Set up an interval to check for reset every minute
    const interval = setInterval(() => {
      if (gasolineStatus) {
        resetGasolineIfNeeded(gasolineStatus);
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [vehicleId]);

  return { gasolineStatus, isGasolineStatusLoading, fetchGasolineStatus };
}