import { useContext, useState } from "react";
import { supabase } from "@/lib/supabase";
import { VehiclesContext } from "@/context/VehiclesContext";
import { PostgrestError } from "@supabase/supabase-js";

export function useVehicles() {
  const { vehicles, setVehicles } = useContext(VehiclesContext);
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [isRefreshingList, setIsRefreshingList] = useState(false);
  const [hasMoreVehicles, setHasMoreVehicles] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<PostgrestError | null>(null);

  async function fetchVehiclesPage(page: number = 1, pageSize: number = 5) {
    setError(null);
    if (page === 1) {
      setIsLoadingList(true);
    } else {
      setIsRefreshingList(true);
    }

    const { data, error } = await supabase
      .from("vehicle")
      .select("*")
      .range((page - 1) * pageSize, page * pageSize - 1);

    if (error) {
      setError(error);
      console.error(error);
      throw error;
    }

    if (data) {
      setVehicles((prevVehicles) => {
        const updatedVehicles = { ...prevVehicles };
        data.forEach((vehicle) => {
          updatedVehicles[vehicle.id] = vehicle;
        });
        return updatedVehicles;
      });
      setHasMoreVehicles(data.length === pageSize);
      setCurrentPage(page);
    }

    setIsLoadingList(false);
    setIsRefreshingList(false);
  }

  async function refreshVehiclesList(pageSize: number = 9) {
    setVehicles({});
    setCurrentPage(1);
    setHasMoreVehicles(true);
    await fetchVehiclesPage(1, pageSize);
  }

  async function fetchVehicleById(vehicleId: string) {
    setError(null);
    if (vehicles[vehicleId]) return;

    const { data, error } = await supabase.from("vehicle").select("*").eq("id", vehicleId).single();

    if (error) {
      setError(error);
      console.error(error);
      throw error;
    }

    if (data) {
      setVehicles((prev) => ({
        ...prev,
        [data.id]: data,
      }));
    }
  }

  async function refreshVehicleById(vehicleId: string) {
    setError(null);
    const { data, error } = await supabase.from("vehicle").select("*").eq("id", vehicleId).single();

    if (error) {
      setError(error);
      console.error(error);
      throw error;
    }

    if (data) {
      setVehicles((prev) => ({
        ...prev,
        [data.id]: data,
      }));
    }
  }

  async function loadMoreVehicles(pageSize: number = 5) {
    if (hasMoreVehicles && !isLoadingList && !isRefreshingList) {
      await fetchVehiclesPage(currentPage + 1, pageSize);
    }
  }

  async function refreshAllVehicles() {
    setHasMoreVehicles(true);
    await refreshVehiclesList();
  }

  return {
    vehicles,
    isLoadingList,
    isRefreshingList,
    hasMoreVehicles,
    currentPage,
    error,
    fetchVehiclesPage,
    refreshVehiclesList,
    fetchVehicleById,
    refreshVehicleById,
    loadMoreVehicles,
    refreshAllVehicles,
  };
}
