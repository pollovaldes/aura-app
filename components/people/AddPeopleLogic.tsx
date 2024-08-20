// ONLY FOR TESTS

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Person = {
  id: string;
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
}

export function useAddPerson() {
  const [nombre, setNombre] = useState("");
  const [apellido_paterno, setApellidoPaterno] = useState("");
  const [apellido_materno, setApellidoMaterno] = useState("");
  const [loading, setLoading] = useState(false);

  const resetFields = () => {
    setNombre("");
    setApellidoPaterno("");
  };

  const handleCreatePerson = async () => {
    
    setLoading(true);
    try {
      const { error } = await supabase.from("profiles").insert([
        { nombre },
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
    nombre,
    apellido_paterno,
    apellido_materno,
    loading,
    setNombre,
    setApellidoPaterno,
    setApellidoMaterno,
    resetFields,
    handleCreatePerson
  };
}
