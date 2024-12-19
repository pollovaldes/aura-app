import { useEffect, useContext, Dispatch, SetStateAction } from "react";
import { supabase } from "@/lib/supabase";
import VehiclesContext from "@/context/VehiclesContext";

export default function useVehicle() {
  const { setVehicles, vehiclesAreLoading, setVehiclesAreLoading, vehicles } = useContext(VehiclesContext);

  const fetchVehicles = async () => {
    setVehiclesAreLoading(true);

    const { data, error } = await supabase.from("vehicles").select("*");

    if (error) {
      setVehicles(null);
      return;
    }

    setVehicles(data);
    console.error("Error from useTruck: ", error);

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
