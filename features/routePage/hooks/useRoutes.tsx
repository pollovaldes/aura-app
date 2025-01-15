import { useContext, useState } from "react";
import { RoutesContext } from "../context/RoutesContext";
import { supabase } from "@/lib/supabase";
import { PostgrestError } from "@supabase/supabase-js";

export function useRoutes() {
  const { routes, setRoutes } = useContext(RoutesContext);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasMorePages, setHasMorePages] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<PostgrestError | null>(null);

  async function LIST_ONLY_fetchRoutes(page: number = 1, pageSize: number = 9, vehicleId: string) {
    setError(null);
    if (page === 1) {
      setIsLoading(true);
    } else {
      setIsRefreshing(true);
    }

    const { data, error } = await supabase
      .from("routes")
      .select(
        `
        *,
        vehicles(*),
        profiles(*),
        route_events(
          *,
          refueling_events(*),
          break_events(*),
          emergency_events(*),
          failure_events(*),
          other_events(*)
        )
      `
      )
      .eq("vehicle_id", vehicleId)
      .range((page - 1) * pageSize, page * pageSize - 1);

    if (error) {
      setError(error);
      console.error(error);
      throw error;
    }

    if (data) {
      setRoutes((prev) => {
        const updated = { ...prev };
        data.forEach((route) => {
          updated[route.id] = route;
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

  async function fetchRouteById(routeId: string) {
    setError(null);

    if (routes[routeId]) {
      return;
    }

    const { data, error } = await supabase
      .from("routes")
      .select(
        `
      *,
      vehicles(*),
      profiles(*),
      route_events(
        *,
        refueling_events(*),
        break_events(*),
        emergency_events(*),
        failure_events(*),
        other_events(*)
      )
    `
      )
      .eq("id", routeId)
      .single();

    if (error) {
      setError(error);
      console.error(error);
      throw error;
    }

    if (data) {
      setRoutes((prev) => {
        const updated = { ...prev };
        updated[data.id] = data;
        return updated;
      });
    }

    setError(null);
  }

  async function refetchRouteById(routeId: string) {
    setError(null);

    const { data, error } = await supabase
      .from("routes")
      .select(
        `
      *,
      vehicles(*),
      profiles(*),
      route_events(
        *,
        refueling_events(*),
        break_events(*),
        emergency_events(*),
        failure_events(*),
        other_events(*)
      )
    `
      )
      .eq("id", routeId)
      .single();

    if (error) {
      setError(error);
      console.error(error);
      throw error;
    }

    if (data) {
      setRoutes((prev) => {
        const updated = { ...prev };
        updated[data.id] = data;
        return updated;
      });
    }

    setError(null);
  }

  return {
    routes,
    isLoading,
    isRefreshing,
    hasMorePages,
    currentPage,
    error,
    LIST_ONLY_fetchRoutes,
    fetchRouteById,
    refetchRouteById,
    setRoutes,
    setCurrentPage,
    setHasMorePages,
  };
}
