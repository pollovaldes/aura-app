// The Logic of the PeopleAdmin Component

import { useLocalSearchParams } from "expo-router";
import TruckPeopleAdminComponent from "./TruckPeopleAdminComponent";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type User = {
  userName: string;
}

export default function TruckPeopleAdminContainer() {
  const { truckId } = useLocalSearchParams<{ truckId: string }>();
  const [user, setUser] = useState<string | null>(null); // Define the type of state
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (truckId) {
      fetchTruckData();
      console.log("Fetching truck data...", truckId, parseInt(truckId));
    }
  }, [truckId]);

  const fetchTruckData = async () => {
    if (truckId) {
      try {
        const { data, error } = await supabase
          .from("Trucks")
          .select("UserN")
          .eq("id", parseInt(truckId)) // Ensure id is converted to number
          .single();

        if (error) throw error;

        setUser(data.UserN);
      } catch (error) {
        console.error("Error fetching truck data:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return <TruckPeopleAdminComponent userName={user}/>;
}

