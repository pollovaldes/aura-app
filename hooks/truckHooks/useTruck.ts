import { useEffect, useContext, Dispatch, SetStateAction } from "react";
import { supabase } from "@/lib/supabase";
import TrucksContext from "@/context/TrucksContext";

export type Truck = {
  id: string;
  brand: string;
  sub_brand: string;
  year: number;
  plate: string;
  serial_number: string;
  economic_number: string;
};

export default function useTruck() {
  const { trucks, setTrucks } = useContext(TrucksContext) ?? {
    trucks: [] as Truck[],
    setTrucks: (() => {}) as Dispatch<SetStateAction<Truck[]>>, // Fallback for setTrucks
  };

  const fetchTrucks = async () => {
    const { data, error } = await supabase
      .from("vehicles")
      .select(
        "id, brand ,sub_brand, year, plate, serial_number, economic_number"
      );

    if (error) {
      console.error(error);
    } else {
      setTrucks(data as unknown as Truck[]); // Si algun día checas esto arturo, soluciona, funciona pero no se por que tengo que poner el unkown
      console.log("Desde el hook", data);
    }
  };

  useEffect(() => {
    fetchTrucks();
  }, []);
  return { trucks };
}
