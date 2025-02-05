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

    const { data, error: fetchError } = await supabase
      .from("route_with_events")
      .select("*")
      .eq("vehicle_id", vehicleId)
      .range((page - 1) * pageSize, page * pageSize - 1);

    if (fetchError) {
      setError(fetchError);
      console.error(fetchError);
      setIsLoading(false);
      setIsRefreshing(false);
      return;
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

    setIsLoading(false);
    setIsRefreshing(false);
  }

  async function fetchRouteById(routeId: string) {
    setError(null);
    if (routes[routeId]) return; // already in dictionary

    const { data, error: fetchError } = await supabase.from("route_with_events").select("*").eq("id", routeId).single();

    if (fetchError) {
      setError(fetchError);
      console.error(fetchError);
      return;
    }

    if (data) {
      setRoutes((prev) => ({ ...prev, [data.id]: data }));
    }
  }

  async function refetchRouteById(routeId: string) {
    setError(null);

    const { data, error: fetchError } = await supabase.from("route_with_events").select("*").eq("id", routeId).single();

    if (fetchError) {
      setError(fetchError);
      console.error(fetchError);
      return;
    }

    if (data) {
      setRoutes((prev) => ({ ...prev, [data.id]: data }));
    }
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
