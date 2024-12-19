import { useState } from "react";
import { Alert } from "react-native";
import { supabase } from "@/lib/supabase";
import { useSession } from "@/context/SessionContext";
import { useLocalSearchParams } from "expo-router";

export function useAssignRole() {
  const [loading, setLoading] = useState(false);
  const session = useSession();
  const { personId } = useLocalSearchParams<{ personId: string }>();

  type Roles = "DRIVER" | "ADMIN" | "OWNER" | "NO_ROLE" | "BANNED";

  const assignUserRole = async (role: Roles) => {
    setLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .update({
        role,
      })
      .eq("id", personId)
      .single();
    if (error) {
      Alert.alert("Error", error.message);
      setLoading(false);
      return;
    }
    Alert.alert("Éxito", "Perfil actualizado");
    setLoading(false);
  };

  return { loading, assignUserRole };
}
