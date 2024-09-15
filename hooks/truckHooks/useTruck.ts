import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useLocalSearchParams } from "expo-router";

export type Truck = {
  id: string;
  brand: string;
  sub_brand: string;
  year: number;
  plate: string;
  serial_number: string;
  economic_number: string;
};

type TruckProps = {
  justOne?: boolean;
  isComplete?: boolean;
};

export default function useTruck({
  justOne = false,
  isComplete = true,
}: TruckProps) {
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [loading, setLoading] = useState(true);
  const { truckId } = useLocalSearchParams<{ truckId: string }>();

  const fetchTrucks = async () => {
    const fieldsToSelect = isComplete
      ? "*"
      : "id, brand ,sub_brand, year, plate, serial_number, economic_number";

    let query = supabase.from("vehicles").select(fieldsToSelect);

    if (justOne && truckId) {
      query = query.eq("id", truckId);
    }

    const { data, error } = await query;

    if (error) {
      console.error(error);
    } else {
      setTrucks(data as unknown as Truck[]); // Si algun día checas esto arturo, soluciona, funciona pero no se por que tengo que poner el unkown
      console.log(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTrucks();
  }, []);
  return { trucks, loading };
}
