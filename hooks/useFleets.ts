import { supabase } from "@/lib/supabase";
import { User } from "@/types/User";
import { Vehicle } from "@/types/Vehicle";
import { useEffect, useState } from "react";

export type Fleet = {
  id: string;
  title: string;
  description: string;
  users: User[];
  vehicles: Vehicle[];
};

export function useFleets(fleet_id?: string) {
  const [fleets, setFleets] = useState<Fleet[] | null>(null);
  const [areFleetsLoading, setAreFleetsLoading] = useState(false);

  const fetchFleetsUserVehicles = async () => {
    let relations = [];
    let fleetData = null;

    if (fleet_id) {
      // Fetch only the relations for the provided fleet_id
      const { data: singleRelations, error: relationsError } = await supabase
        .from("fleets_users_vehicles")
        .select("fleet_id, user_id, vehicle_id")
        .eq("fleet_id", fleet_id);

      if (relationsError) {
        alert(
          `Ocurrió un error al obtener las relaciones de las flotillas: \n\nMensaje de error: ${relationsError.message}\n\nCódigo de error: ${relationsError.code}\n\nDetalles: ${relationsError.details}\n\nSugerencia: ${relationsError.hint}`,
        );
        return null;
      }

      relations = singleRelations;

      // Fetch the specific fleet
      const { data: singleFleet, error: fleetError } = await supabase
        .from("fleets")
        .select("id, title, description")
        .eq("id", fleet_id)
        .single();

      if (fleetError) {
        alert(
          `Ocurrió un error al obtener la flotilla: \n\nMensaje de error: ${fleetError.message}\n\nCódigo de error: ${fleetError.code}\n\nDetalles: ${fleetError.details}\n\nSugerencia: ${fleetError.hint}`,
        );
        return null;
      }

      fleetData = [singleFleet];
    } else {
      // Fetch all relations
      const { data: allRelations, error: relationsError } = await supabase
        .from("fleets_users_vehicles")
        .select("fleet_id, user_id, vehicle_id");

      if (relationsError) {
        alert(
          `Ocurrió un error al obtener las relaciones de las flotillas: \n\nMensaje de error: ${relationsError.message}\n\nCódigo de error: ${relationsError.code}\n\nDetalles: ${relationsError.details}\n\nSugerencia: ${relationsError.hint}`,
        );
        return null;
      }

      relations = allRelations;

      // Fetch all fleets
      const { data: allFleets, error: fleetError } = await supabase
        .from("fleets")
        .select("id, title, description");

      if (fleetError) {
        alert(
          `Ocurrió un error al obtener las flotillas: \n\nMensaje de error: ${fleetError.message}\n\nCódigo de error: ${fleetError.code}\n\nDetalles: ${fleetError.details}\n\nSugerencia: ${fleetError.hint}`,
        );
        return null;
      }

      fleetData = allFleets;
    }

    if (!fleetData) return null;

    // Extract user and vehicle IDs from relations
    const userIds = [...new Set(relations.map((rel) => rel.user_id))];
    const vehicleIds = [...new Set(relations.map((rel) => rel.vehicle_id))];

    // Fetch only necessary users
    const { data: userData, error: userError } = await supabase
      .from("profiles")
      .select(
        "id, name, father_last_name, mother_last_name, position, role, is_fully_registered",
      )
      .in("id", userIds);

    if (userError) {
      alert(
        `Ocurrió un error al obtener los usuarios: \n\nMensaje de error: ${userError.message}\n\nCódigo de error: ${userError.code}\n\nDetalles: ${userError.details}\n\nSugerencia: ${userError.hint}`,
      );
    }

    // Fetch only necessary vehicles
    const { data: vehicleData, error: vehicleError } = await supabase
      .from("vehicles")
      .select(
        "id, brand, sub_brand, year, plate, serial_number, economic_number, gasoline_threshold",
      )
      .in("id", vehicleIds);

    if (vehicleError) {
      alert(
        `Ocurrió un error al obtener los vehículos: \n\nMensaje de error: ${vehicleError.message}\n\nCódigo de error: ${vehicleError.code}\n\nDetalles: ${vehicleError.details}\n\nSugerencia: ${vehicleError.hint}`,
      );
    }

    // Map relations to fleets
    const fleetsWithDetails = fleetData.map((fleet) => {
      const fleetRelations = relations.filter(
        (rel) => rel.fleet_id === fleet.id,
      );

      const users = fleetRelations
        .map((rel) => userData?.find((user) => user.id === rel.user_id))
        .filter(Boolean) as User[];

      const vehicles = fleetRelations
        .map((rel) =>
          vehicleData?.find((vehicle) => vehicle.id === rel.vehicle_id),
        )
        .filter(Boolean) as Vehicle[];

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
