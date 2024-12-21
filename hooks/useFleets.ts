import { supabase } from "@/lib/supabase";
import { Fleet, Profile, Vehicle } from "@/types/globalTypes";
import { useEffect, useState } from "react";

export function useFleets(fleetId?: string) {
  const [fleets, setFleets] = useState<Fleet[] | null>(null);
  const [areFleetsLoading, setAreFleetsLoading] = useState<boolean>(false);

  const fetchFleets = async () => {
    setAreFleetsLoading(true);

    let query = supabase.from("fleets").select(`
      *,
      fleets_users (
        *,
        profiles (*)
      ),
      fleets_vehicles (
        *,
        vehicles (*)
      )
    `);

    if (fleetId) {
      query = query.eq("id", fleetId);
    }

    const { data, error } = await query;

    if (error) {
      console.error(
        `Error fetching fleet records: \n\n` +
          `Message: ${error.message}\n\n` +
          `Code: ${error.code}\n\n` +
          `Details: ${error.details}\n\n` +
          `Hint: ${error.hint}`
      );
      setAreFleetsLoading(false);
      setFleets(null);
      return;
    }

    const normalizedFleets: Fleet[] = data.map((fleet) => {
      const users = (fleet.fleets_users || [])
        .map((relation) => relation.profiles)
        .filter((profile): profile is Profile => profile !== null);
      const vehicles = (fleet.fleets_vehicles || [])
        .map((relation) => relation.vehicles)
        .filter((vehicle): vehicle is Vehicle => vehicle !== null);

      return {
        ...fleet,
        users,
        vehicles,
      };
    });

    setFleets(normalizedFleets);
    setAreFleetsLoading(false);
  };

  useEffect(() => {
    fetchFleets();
  }, []);

  return { fleets, areFleetsLoading, fetchFleets };
}
