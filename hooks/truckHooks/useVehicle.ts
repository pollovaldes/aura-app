import { useContext, useState } from "react";
import { supabase } from "@/lib/supabase";
import { VehiclesContext } from "@/context/VehiclesContext";

export function useVehicles() {
  const { vehicles, setVehicles } = useContext(VehiclesContext);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasMorePages, setHasMorePages] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  async function LIST_ONLY_fetchVehicles(page: number = 1, pageSize: number = 9) {
    if (page === 1) {
      setIsLoading(true);
    } else {
      setIsRefreshing(true);
    }

    const { data, error } = await supabase
      .from("vehicles")
      .select("*")
      .range((page - 1) * pageSize, page * pageSize - 1);

    if (error) {
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
    if (vehicles[vehicleId]) {
      return;
    }

    const { data, error } = await supabase.from("vehicles").select("*").eq("id", vehicleId).single();

    if (error) {
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

  async function refetchVehicleById(vehicleId: string) {
    const { data, error } = await supabase.from("vehicles").select("*").eq("id", vehicleId).single();

    if (error) {
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
    LIST_ONLY_fetchVehicles,
    refetchAllVehicles,
    fetchVehicleById,
    refetchVehicleById,
    LIST_ONLY_loadMoreVehicles,
    handleRefresh,
  };
}
