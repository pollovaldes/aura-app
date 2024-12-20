import { useEffect, useContext } from "react";
import { supabase } from "@/lib/supabase";
import VehiclesContext from "@/context/VehiclesContext";

export default function useVehicle() {
  const { setVehicles, vehiclesAreLoading, setVehiclesAreLoading, vehicles } = useContext(VehiclesContext);

  const fetchVehicles = async () => {
    setVehiclesAreLoading(true);

    const { data, error } = await supabase.from("vehicles").select("*");

    if (error) {
      setVehicles(null);
      setVehiclesAreLoading(false);
      throw error;
    }

    setVehicles(data);
    setVehiclesAreLoading(false);
  };

  useEffect(() => {
    if (!vehicles) {
      fetchVehicles();
    }
  }, []);

  return {
    vehicles,
    vehiclesAreLoading,
    setVehicles,
    fetchVehicles,
  };
}
