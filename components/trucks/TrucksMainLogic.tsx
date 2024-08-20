//TrucksMainLogic

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Truck = {
  id: number;
  numero_economico: string;
  marca: string;
  sub_marca: string;
  modelo: string;
  no_serie: string;
  placa: string;
  poliza: string;
  id_usuario: string;
}

export default function TruckHandler() {
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrucks = async () => {
      const { data, error } = await supabase
        .from("camiones") // Reemplaza 'testSupa' con el nombre de tu tabla si es necesario
        .select("*");

      if (error) {
        console.error(error);
      } else {
        setTrucks(data);
      }
      setLoading(false);
    };

    fetchTrucks();

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
  }, []);
  return { trucks, loading };
}
