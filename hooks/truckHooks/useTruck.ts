import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useLocalSearchParams } from "expo-router";

export type Truck = {
  id: string;
  numero_economico: string;
  marca: string;
  sub_marca: string;
  modelo: string;
  no_serie?: string;
  placa?: string;
  poliza?: string;
  id_usuario?: string;
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

  useEffect(() => {
    const fetchTrucks = async () => {
      const fieldsToSelect = isComplete
        ? "*"
        : "id, numero_economico ,marca, sub_marca, modelo";

      let query = supabase
        .from("camiones")
        .select(fieldsToSelect)
        .order("numero_economico", { ascending: true });

      if (justOne && truckId) {
        query = query.eq("id", truckId);
      }

      const { data, error } = await query;

      if (error) {
        console.error(error);
      } else {
        setTrucks(data as unknown as Truck[]); // Si algun día checas esto arturo, soluciona, funciona pero no se por que tengo que poner el unkown
      }
      setLoading(false);
    };

    fetchTrucks();

    /*
    // Configurar la suscripción para escuchar los cambios en la tabla
    const subscription = supabase
      .channel("public:camiones") // Nombre del canal arbitrario
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "camiones" }, // Especifica el esquema y la tabla
        (payload) => {
          console.log("Cambio en la tabla:", payload);
          // Manejar el evento según el tipo de cambio
          fetchTrucks(); // Refresca los datos
        }
      )
      .subscribe();

    // Limpia la suscripción al desmontar el componente
    return () => {
      supabase.removeChannel(subscription); 
    };
    */
  }, []);
  return { trucks, loading };
}
