// AddTruckLogic.ts

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Person = {
  user_Id: number;
  name: string;
  age: number;
}

export function useAddTruck() {
  const [marca, setMarca] = useState("");
  const [submarca, setSubmarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [selectedDriver, setSelectedDriver] = useState<Person | null>(null);
  const [drivers, setDrivers] = useState<Person[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchDrivers() {
      const { data, error } = await supabase.from("UsersTest").select("*");
      if ( error ) {
        console.error( "Error al obtener los conductores:", error );
      } else {
        setDrivers( data );
      }
    }
    fetchDrivers();

    const subscription = supabase
    .channel("public:People")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "UsersTest" },
      (payload) => {
        console.log("Table People change:", payload);
        fetchDrivers();
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(subscription);
  };

  }, []);

  const resetFields = () => {
    setMarca("");
    setSubmarca("");
    setModelo("");
    setSelectedDriver(null);
  };

  const handleCreateTruck = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.from("Trucks").insert([
        { marca, submarca, modelo: parseInt(modelo), name: selectedDriver?.name },
      ]);
      if (error) {
        console.error("Error al crear camión:", error);
      } else {
        resetFields();
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    marca,
    submarca,
    modelo,
    selectedDriver,
    drivers,
    loading,
    setMarca,
    setSubmarca,
    setModelo,
    setSelectedDriver,
    handleCreateTruck,
    resetFields,
  };
}
