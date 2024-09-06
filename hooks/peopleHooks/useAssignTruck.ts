import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { Alert } from "react-native";
import useTruck from "../truckHooks/useTruck";
import usePeople from "./usePeople";

type AssignTruckProps = {
  id_conductor: string;
};

export function useAssignTruck({ id_conductor: m_id_conductor }: AssignTruckProps) {
  const [loading, setLoading] = useState(false);

  const assignTruck = async (id_camiones: string[]) => {
    setLoading(true);

    try {
      for (const id_camion of id_camiones) {
        const { data, error } = await supabase
          .from("conductor_camion")
          .insert({
            id_camion: id_camion,
            id_conductor: m_id_conductor,
          })

        if (error) {
          Alert.alert("Error", error.message);
          setLoading(false);
          throw error;
        }
      }

      Alert.alert("Éxito", "Camiones asignados correctamente");
      } catch (error) {
        Alert.alert("Error");
      } finally {
        setLoading(false);
      }
    };

    return { loading, assignTruck };
  }

