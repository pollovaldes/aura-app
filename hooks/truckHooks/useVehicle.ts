// hooks/useTruck.ts
import { useEffect, useContext, Dispatch, SetStateAction } from "react";
import { supabase } from "@/lib/supabase";
import VehiclesContext from "@/context/VehiclesContext";
import { Vehicle } from "@/types/Vehicle";

export default function useVehicle() {
  const { setVehicles, vehiclesAreLoading, setVehiclesAreLoading, vehicles } =
    useContext(VehiclesContext);

  const fetchVehicles = async () => {
    setVehiclesAreLoading(true);
    try {
      const { data, error } = await supabase
        .from("vehicles")
        .select(
          "id, brand, sub_brand, year, plate, serial_number, economic_number"
        );

      if (!error) {
        const vehiclesData = data as Vehicle[];
        setVehicles(vehiclesData);
        console.log("Desde el hook", vehiclesData);
        setVehiclesAreLoading(false);
      } else {
        console.error("Error from useTruck: ", error);
        setVehicles(null);
        setVehiclesAreLoading(false);
      }
    } catch (error) {
      console.error("Error fetching vehicles: ", error);
      setVehicles(null);
    }
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
