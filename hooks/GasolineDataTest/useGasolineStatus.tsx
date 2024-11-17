import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export interface GasolineStatus {
  remaining_gasoline: number;
  gasoline_threshold: number;
  spent_gasoline: number;
}

export default function useGasolineStatus(vehicleId: string | undefined) {
  const [gasolineStatus, setGasolineStatus] = useState<GasolineStatus | null>(null);
  const [isGasolineStatusLoading, setIsGasolineStatusLoading] = useState(true);

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
      setGasolineStatus(data);
    }
    setIsGasolineStatusLoading(false);
  };

  useEffect(() => {
    fetchGasolineStatus();
  }, [vehicleId]);

  return { gasolineStatus, isGasolineStatusLoading, fetchGasolineStatus };
}