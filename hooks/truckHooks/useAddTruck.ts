// AddTruckLogic.ts

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export function useAddTruck() {
  const [numEco, setNumEco] = useState("");
  const [marca, setMarca] = useState("");
  const [submarca, setSubmarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [serie, setSerie] = useState("");
  const [placa, setPlaca] = useState("");
  const [poliza, setPoliza] = useState("");
  const [loading, setLoading] = useState(false);

  const resetFields = () => {
    setNumEco("");
    setMarca("");
    setSubmarca("");
    setModelo("");
    setSerie("");
    setPlaca("");
    setPoliza("");
  };

  const handleCreateTruck = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.from("camiones").insert([
        {  
          numero_economico: numEco, 
          marca, sub_marca: submarca, 
          modelo, no_serie: 
          serie, 
          placa, 
          poliza 
        },
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
    numEco,
    marca,
    submarca,
    modelo,
    serie,
    placa,
    poliza,
    loading,
    setNumEco,
    setMarca,
    setSubmarca,
    setModelo,
    setSerie,
    setPlaca,
    setPoliza,
    handleCreateTruck,
    resetFields,
  };
}
