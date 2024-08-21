// The Logic of the PeopleAdmin Component

import { useLocalSearchParams } from "expo-router";
import TruckPeopleAdminComponent from "./TruckPeopleAdminComponent";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function TruckPeopleAdminContainer() {
  const { personId } = useLocalSearchParams<{ personId: string }>();
  const [user, setUser] = useState<string | null>(null); // Define the type of state
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (personId) {
      fetchTruckData();
      console.log("Fetching truck data...", personId);
    }
  }, [personId]);

  const fetchTruckData = async () => {
    if (personId) {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("nombre")
          .eq("id", personId) // Ensure id is converted to number
          .single();

        if (error) throw error;

        console.log("Data", data);

        setUser(data.nombre);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    }
  };

  console.log("User", user);
  return <TruckPeopleAdminComponent name={user}/>;
}

