// AddTruckLogic.ts

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export function useAddTruck() {
  const [marca, setMarca] = useState("");
  const [submarca, setSubmarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [loading, setLoading] = useState(false);

  const resetFields = () => {
    setMarca("");
    setSubmarca("");
    setModelo("");
  };

  const handleCreateTruck = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.from("Trucks").insert([
        { marca, submarca, modelo: parseInt(modelo) },
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
    loading,
    setMarca,
    setSubmarca,
    setModelo,
    handleCreateTruck,
    resetFields,
  };
}
