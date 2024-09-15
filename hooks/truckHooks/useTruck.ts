import { useEffect, useContext, Dispatch, SetStateAction } from "react";
import { supabase } from "@/lib/supabase";
import TrucksContext from "@/context/TrucksContext";
import { Truck } from "@/types/Truck";

export default function useTruck() {
  const { trucks, setTrucks, isLoading, setIsLoading } = useContext(
    TrucksContext
  ) ?? {
    trucks: null as Truck[] | null,
    setTrucks: (() => {}) as Dispatch<SetStateAction<Truck[] | null>>,
    setIsLoading: undefined as unknown as Dispatch<SetStateAction<boolean>>,
    isLoading: undefined as unknown as boolean,
  };

  const fetchTrucks = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("vehicles")
      .select(
        "id, brand ,sub_brand, year, plate, serial_number, economic_number"
      );

    if (error) {
      console.error("Error from useTruck: ", error);
      setTrucks(null);
      setIsLoading(false);
    } else {
      setTrucks(data as unknown as Truck[]); // Si algun día checas esto arturo, soluciona, funciona pero no se por que tengo que poner el unkown
      console.log("Desde el hook", data);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!trucks) {
      fetchTrucks();
    }
  }, []);
  return { trucks, fetchTrucks, isLoading };
}
