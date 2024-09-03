import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { Alert } from "react-native";
import useTruck from "../truckHooks/useTruck";
import usePeople from "./usePeople";

type AssignTruckProps = {
  id_conductor: string;
  id_camion: string;
};

export function useAssignTruck({ id_conductor: m_id_conductor, id_camion: m_id_camion }: AssignTruckProps) {
  const [loading, setLoading] = useState(false);

  const assignRole = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("conductor_camion")
      .insert({
        id_camion: m_id_camion,
        id_conductor: m_id_conductor,
      })
    if (error) {
      Alert.alert("Error", error.message);
      setLoading(false);
      return;
    }
    Alert.alert("Éxito", "Perfil actualizado");
    setLoading(false);
  }

  return { loading };
}

