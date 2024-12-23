import { useContext, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import VehiclesContext from "@/context/VehiclesContext";

export default function useVehicle() {
  const { vehicles, setVehicles, currentPage, setCurrentPage, hasMorePages, setHasMorePages } =
    useContext(VehiclesContext);

  const fetchVehicles = async (page = 1) => {
    const { data, error } = await supabase
      .from("vehicles")
      .select("*")
      .range((page - 1) * 9, page * 9 - 1); // Fetch vehicles 9 at a time

    if (error) {
      setVehicles(null);
      setHasMorePages(false);
      return;
    }

    setVehicles((prevVehicles) => {
      const allVehicles = prevVehicles ? [...prevVehicles, ...data] : data;
      return allVehicles.filter((vehicle, index, self) => self.findIndex((v) => v.id === vehicle.id) === index);
    });

    setCurrentPage(page);
    setHasMorePages(data.length > 0); // If less than 9 vehicles are fetched, assume no more pages
  };

  const fetchVehicleById = async (vehicleId: string) => {
    const existingVehicle = vehicles?.find((vehicle) => vehicle.id === vehicleId);

    if (existingVehicle) {
      return existingVehicle; // Return the vehicle from the context
    }

    const { data, error } = await supabase.from("vehicles").select("*").eq("id", vehicleId).single();

    if (error || !data) {
      setVehicles(null);
      setHasMorePages(false);
      return;
    }

    setVehicles((prevVehicles) => {
      const allVehicles = prevVehicles ? [...prevVehicles, data] : [data];
      return allVehicles.filter((vehicle, index, self) => self.findIndex((v) => v.id === vehicle.id) === index);
    });

    return data;
  };

  const refetchVehicleById = async (vehicleId: string) => {
    const { data, error } = await supabase.from("vehicles").select("*").eq("id", vehicleId).single();

    if (error || !data) {
      setVehicles(null);
      setHasMorePages(false);
      return;
    }

    setVehicles((prevVehicles) => {
      const allVehicles = prevVehicles
        ? prevVehicles.map((vehicle) => (vehicle.id === vehicleId ? { ...vehicle, ...data } : vehicle))
        : [data];

      return allVehicles;
    });

    return data;
  };

  return {
    vehicles,
    fetchVehicles,
    fetchVehicleById,
    refetchVehicleById,
    currentPage,
    hasMorePages,
    setVehicles,
  };
}
