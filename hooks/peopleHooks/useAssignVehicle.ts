import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { Alert } from "react-native";

type AssignTruckVehicle = {
  user_id: string | undefined;
};

export default function useAssignVehicle({
  user_id,
}: AssignTruckVehicle) {
  const [loading, setLoading] = useState(false);

  const assignVehicle = async (vehicle_ids: string[]) => {
    setLoading(true);

    try {
      for (const vehicle_id of vehicle_ids) {
        const { data, error } = await supabase.from("vehicle_user").insert({
          vehicle_id,
          user_id,
        });

        if (error) {
          Alert.alert("Error", error.message);
          setLoading(false);
          throw error;
        }
      }

      Alert.alert("Éxito", "Camiones asignados correctamente");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, assignVehicle };
}
