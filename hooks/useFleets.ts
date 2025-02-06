import { FleetsContext } from "@/context/FleetsContext";
import { supabase } from "@/lib/supabase";
import { Fleet, FleetRow } from "@/types/globalTypes";
import { useContext, useState } from "react";
import { useVehicles } from "./truckHooks/useVehicle";
import { PostgrestError } from "@supabase/supabase-js";
import { useUsers } from "./peopleHooks/useUsers";

export function useFleets() {
  const { fleets, setFleets } = useContext(FleetsContext);
  const { vehicles, fetchVehicleById } = useVehicles();
  const { users, fetchUserById } = useUsers();
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [isRefreshingList, setIsRefreshingList] = useState(false);
  const [hasMoreFleets, setHasMoreFleets] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<PostgrestError | null>(null);

  async function buildFleetFromRow(fleetRow: FleetRow): Promise<Partial<Fleet>> {
    const fleetId = fleetRow.id;

    const { data: userFleetData, error: userFleetError } = await supabase
      .from("user_fleet")
      .select("user_id")
      .eq("fleet_id", fleetId);

    if (userFleetError) {
      setError(userFleetError);
      console.error(userFleetError);
      throw userFleetError;
    }

    const userIds = userFleetData.map((item: { user_id: string }) => item.user_id);

    const { data: vehicleFleetData, error: vehicleFleetError } = await supabase
      .from("vehicle_fleet")
      .select("vehicle_id")
      .eq("fleet_id", fleetId);

    if (vehicleFleetError) {
      setError(vehicleFleetError);
      console.error(vehicleFleetError);
      throw vehicleFleetError;
    }

    const vehicleIds = vehicleFleetData.map((item: { vehicle_id: string }) => item.vehicle_id);

    await Promise.all(userIds.map((userId) => (users[userId] ? Promise.resolve() : fetchUserById(userId))));
    await Promise.all(
      vehicleIds.map((vehicleId) => (vehicles[vehicleId] ? Promise.resolve() : fetchVehicleById(vehicleId)))
    );

    const fleetUsers = userIds.map((uid) => users[uid]).filter(Boolean);
    const fleetVehicles = vehicleIds.map((vid) => vehicles[vid]).filter(Boolean);

    const fleet: Partial<Fleet> = {
      id: fleetRow.id,
      title: fleetRow.title,
      description: fleetRow.description,
      users: fleetUsers,
      vehicles: fleetVehicles,
    };

    setFleets((prev) => ({ ...prev, [fleet.id!]: fleet }));
    return fleet;
  }

  async function fetchFleetById(fleetId: string) {
    setError(null);

    if (fleets[fleetId] && fleets[fleetId].users && fleets[fleetId].vehicles) {
      return;
    }

    const { data, error: fleetError } = await supabase.from("fleet").select("*").eq("id", fleetId).single();

    if (fleetError) {
      setError(fleetError);
      console.error(fleetError);
      throw fleetError;
    }

    if (data) {
      await buildFleetFromRow(data);
    }

    setError(null);
  }

  async function refreshFleetById(fleetId: string) {
    setError(null);

    const { data, error: fleetError } = await supabase.from("fleet").select("*").eq("id", fleetId).single();

    if (fleetError) {
      setError(fleetError);
      console.error(fleetError);
      throw fleetError;
    }

    if (data) {
      await buildFleetFromRow(data);
    }

    setError(null);
  }

  async function fetchFleetsPage(page: number = 1, pageSize: number = 5) {
    setError(null);

    if (page === 1) {
      setIsLoadingList(true);
    } else {
      setIsRefreshingList(true);
    }

    const { data, error: fleetsError } = await supabase
      .from("fleet")
      .select("*")
      .range((page - 1) * pageSize, page * pageSize - 1);

    if (fleetsError) {
      setError(fleetsError);
      console.error(fleetsError);
      throw fleetsError;
    }

    if (data) {
      await Promise.all(data.map((fleetRow: FleetRow) => buildFleetFromRow(fleetRow)));
      setHasMoreFleets(data.length === pageSize);
      setCurrentPage(page);
    }

    setIsLoadingList(false);
    setIsRefreshingList(false);
  }

  async function refreshFleetsList(pageSize: number = 9) {
    setFleets({});
    setCurrentPage(1);
    setHasMoreFleets(true);
    await fetchFleetsPage(1, pageSize);
  }

  async function loadMoreFleets(pageSize: number = 5) {
    if (hasMoreFleets && !isLoadingList && !isRefreshingList) {
      await fetchFleetsPage(currentPage + 1, pageSize);
    }
  }

  async function refreshAllFleets() {
    setHasMoreFleets(true);
    await refreshFleetsList();
  }

  return {
    fleets,
    isLoadingList,
    isRefreshingList,
    hasMoreFleets,
    currentPage,
    error,
    fetchFleetsPage,
    refreshFleetsList,
    fetchFleetById,
    refreshFleetById,
    loadMoreFleets,
    refreshAllFleets,
  };
}
