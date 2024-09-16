// hooks/useTruck.ts
import {
  useEffect,
  useContext,
  Dispatch,
  SetStateAction
} from "react";
import { supabase } from "@/lib/supabase";
import TrucksContext from "@/context/TrucksContext";
import { Truck } from "@/types/Truck";

export default function useTruck() {
  const { trucks, setTrucks, trucksAreLoading, setTrucksAreLoading } =
    useContext(TrucksContext) ?? {
      trucks: null as Truck[] | null,
      setTrucks: (() => {}) as Dispatch<SetStateAction<Truck[] | null>>,
      setTrucksAreLoading: undefined as unknown as Dispatch<
        SetStateAction<boolean>
      >,
      trucksAreLoading: undefined as unknown as boolean,
      setThumbnailIsLoading: undefined as unknown as Dispatch<
        SetStateAction<boolean>
      >,
    };

  const fetchTrucks = async () => {
    setTrucksAreLoading(true);
    try {
      const { data, error } = await supabase
        .from("vehicles")
        .select(
          "id, brand, sub_brand, year, plate, serial_number, economic_number"
        );

      if (!error) {
        const trucksData = data as Truck[];
        setTrucks(trucksData);
        console.log("Desde el hook", trucksData);
        setTrucksAreLoading(false);
      } else {
        console.error("Error from useTruck: ", error);
        setTrucks(null);
        setTrucksAreLoading(false);
      }
    } catch (error) {
      console.error("Error fetching trucks: ", error);
      setTrucks(null);
    }
  };

  useEffect(() => {
    if (!trucks) {
      fetchTrucks();
    }
  }, []);

  return {
    trucks,
    setTrucks,
    fetchTrucks,
    trucksAreLoading,
  };
}
