import { useContext, useState } from "react";
import { supabase } from "@/lib/supabase";
import { VehiclesContext } from "@/context/VehiclesContext";
import { PostgrestError } from "@supabase/supabase-js";

export function useVehicles() {
  const { vehicles, setVehicles } = useContext(VehiclesContext);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasMorePages, setHasMorePages] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<PostgrestError | null>(null);

  async function LIST_ONLY_fetchVehicles(page: number = 1, pageSize: number = 5) {
    setError(null);

    if (page === 1) {
      setIsLoading(true);
    } else {
      setIsRefreshing(true);
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
      setVehicles((prev) => {
        const updated = { ...prev };
        data.forEach((vehicle) => {
          updated[vehicle.id] = vehicle;
        });
        return updated;
      });
      setHasMorePages(data.length === pageSize);
      setCurrentPage(page);
    }

    setError(null);
    setIsLoading(false);
    setIsRefreshing(false);
  }

  async function refetchAllVehicles(pageSize: number = 9) {
    setVehicles({});
    setCurrentPage(1);
    setHasMorePages(true);
    await LIST_ONLY_fetchVehicles(1, pageSize);
  }

  async function fetchVehicleById(vehicleId: string) {
    setError(null);

    if (vehicles[vehicleId]) {
      return;
    }

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

    setError(null);
  }

  async function refetchVehicleById(vehicleId: string) {
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

    setError(null);
  }

  async function LIST_ONLY_loadMoreVehicles() {
    if (hasMorePages && !isRefreshing && !isLoading) {
      await LIST_ONLY_fetchVehicles(currentPage + 1);
    }
  }

  async function handleRefresh() {
    setHasMorePages(true);
    await refetchAllVehicles();
  }

  return {
    vehicles,
    isLoading,
    isRefreshing,
    hasMorePages,
    currentPage,
    error,
    LIST_ONLY_fetchVehicles,
    refetchAllVehicles,
    fetchVehicleById,
    refetchVehicleById,
    LIST_ONLY_loadMoreVehicles,
    handleRefresh,
  };
}
