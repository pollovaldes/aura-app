import { useContext } from "react";
import { supabase } from "@/lib/supabase";
import { Vehicle } from "@/types/globalTypes";
import { VehiclesContext } from "@/context/VehiclesContext";

export function useVehicle() {
  const { vehicles, setVehicles } = useContext(VehiclesContext);

  const fetchVehicles = async (page: number, pageSize: number = 9): Promise<Vehicle[]> => {
    const { data, error } = await supabase
      .from("vehicles")
      .select("*")
      .range((page - 1) * pageSize, page * pageSize - 1);

    if (error) {
      console.error(error);
      throw error;
    }

    if (data) {
      setVehicles((prev) => {
        const updated = { ...prev };
        data.forEach((vehicle) => {
          updated[vehicle.id] = vehicle;
        });
        return updated;
      });
    }

    return data || [];
  };

  const fetchVehicleById = async (vehicleId: string): Promise<Vehicle | null> => {
    const existing = vehicles[vehicleId];
    if (existing) return existing;

    const { data, error } = await supabase.from("vehicles").select("*").eq("id", vehicleId).single();

    if (error) {
      console.error(error);
      throw error;
    }

    if (data) {
      setVehicles((prev) => ({
        ...prev,
        [data.id]: data,
      }));
      return data;
    }

    return null;
  };

  const refetchVehicleById = async (vehicleId: string): Promise<Vehicle | null> => {
    const { data, error } = await supabase.from("vehicles").select("*").eq("id", vehicleId).single();

    if (error) {
      console.error(error);
      throw error;
    }

    if (data) {
      setVehicles((prev) => ({
        ...prev,
        [data.id]: { ...prev[vehicleId], ...data },
      }));
      return data;
    }

    return null;
  };

  return {
    vehicles,
    fetchVehicles,
    fetchVehicleById,
    refetchVehicleById,
  };
}
