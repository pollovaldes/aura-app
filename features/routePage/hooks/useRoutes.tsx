import { useContext, useState } from "react";
import { RoutesContext } from "../context/RoutesContext";
import { supabase } from "@/lib/supabase";

export function useRoutes() {
  const { routes, setRoutes } = useContext(RoutesContext);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasMorePages, setHasMorePages] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  async function LIST_ONLY_fetchRoutes(page: number = 1, pageSize: number = 9) {
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
      .single();

    const ROUTE_TYPE = typeof data;

    if (error) {
      console.error(error);
      throw error;
    }

    if (data) {
      console.log("DATA", data);

      // setRoutes((prev) => {
      //   const updated = { ...prev };
      //   data.forEach((route) => {
      //     updated[route.id] = route;
      //   });
      //   return updated;
      // });
      // setHasMorePages(data.length === pageSize);
      // setCurrentPage(page);
    }

    setIsLoading(false);
    setIsRefreshing(false);
  }

  async function refetchAllRoutes(pageSize: number = 9) {
    setRoutes({});
    setCurrentPage(1);
    setHasMorePages(true);
    await LIST_ONLY_fetchRoutes(1, pageSize);
  }

  async function fetchRouteById(routeId: string) {
    if (routes[routeId]) {
      return;
    }

    const { data, error } = await supabase.from("routes").select("*").eq("id", routeId).single();

    if (error) {
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
  }

  return {
    routes,
    setRoutes,
    isLoading,
    isRefreshing,
    hasMorePages,
    currentPage,
    LIST_ONLY_fetchRoutes,
    refetchAllRoutes,
    fetchRouteById,
  };
}
