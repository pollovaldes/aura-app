import { useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { supabase } from "@/lib/supabase";

interface Truck {
  id: number;
  marca: string;
  submarca: string;
  modelo: number;
}

export default function TruckHandler() {
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrucks = async () => {
      const { data, error } = await supabase
        .from("Trucks") // Reemplaza 'testSupa' con el nombre de tu tabla si es necesario
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
      .channel("public:Trucks") // Nombre del canal arbitrario
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "Trucks" }, // Especifica el esquema y la tabla
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
