import { supabase } from "@/lib/supabase";
import { Fleet, Profile, Vehicle } from "@/types/globalTypes";
import { useEffect, useState } from "react";

export function useFleets(fleet_id?: string) {
  const [fleets, setFleets] = useState<Fleet[] | null>(null);
  const [areFleetsLoading, setAreFleetsLoading] = useState(false);

  const fetchFleetsUserVehicles = async () => {
    // Craft a typed query.
    // Note: `fleets_users_vehicles` should have relationships set up so that:
    // - user_id references profiles.id
    // - vehicle_id references vehicles.id
    // The nesting allows pulling related tables in one go.

    let query = supabase.from("fleets").select(`
    *,
    fleets_users_vehicles (
      *,
      profiles (
        *
      ),
      vehicles (
        *
      )
    )
  `);

    if (fleet_id) {
      query = query.eq("id", fleet_id);
    }

    const { data, error } = await query;

    if (error) {
      alert(
        `Ocurrió un error al obtener las flotillas:\n\nMensaje de error: ${error.message}\nCódigo de error: ${error.code}\nDetalles: ${error.details}\nSugerencia: ${error.hint}`
      );
      return null;
    }

    if (!data) return null;

    // Normalize data in case of single query vs multiple.
    const normalizedFleetsData = Array.isArray(data) ? data : [data];

    // Map the returned data into our Fleet structure
    const fleetsWithDetails: Fleet[] = normalizedFleetsData.map((fleet) => {
      const relations = fleet.fleets_users_vehicles ?? [];

      const users = relations.map((r) => r.profiles).filter((p): p is Profile => p !== null);

      const vehicles = relations.map((r) => r.vehicles).filter((v): v is Vehicle => v !== null);

      return {
        ...fleet,
        users,
        vehicles,
      };
    });

    return fleetsWithDetails;
  };

  const fetchFleets = async () => {
    setAreFleetsLoading(true);
    const fetchedFleets = await fetchFleetsUserVehicles();
    setFleets(fetchedFleets);
    setAreFleetsLoading(false);
  };

  useEffect(() => {
    fetchFleets();
  }, [fleet_id]);

  return { fleets, areFleetsLoading, fetchFleets };
}
