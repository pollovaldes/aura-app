// The Logic of the PeopleAdmin Component

import { useLocalSearchParams } from "expo-router";
import TruckPeopleAdminComponent from "./TruckPeopleAdminComponent";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Person = {
  id: string;
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  email: string;
  phone: string;
  registrado: boolean;
}

export default function TruckPeopleAdminContainer() {
  const { personId } = useLocalSearchParams<{ personId: string }>();
  const [user, setUser] = useState<Person | null>(null); // Define the type of state
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
          .select("*")
          .eq("id", personId) // Ensure id is converted to number
          .single();

        if (error) throw error;
        setUser(data);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    }
  };

  return <TruckPeopleAdminComponent user={user} loading={loading}/>;
}

