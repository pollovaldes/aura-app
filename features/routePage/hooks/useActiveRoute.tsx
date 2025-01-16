import { useContext, useEffect, useState } from "react";
import { RoutesContext } from "../context/RoutesContext";
import { supabase } from "@/lib/supabase";
import { PostgrestError } from "@supabase/supabase-js";

export function useActiveRoute() {
  const { routes, setRoutes, activeRouteId, setActiveRouteId, activeRouteIsLoading, setActiveRouteIsLoading } =
    useContext(RoutesContext);

  const [error, setError] = useState<PostgrestError | null>(null);

  async function fetchActiveRoute() {
    setActiveRouteIsLoading(true);
    setError(null);

    const { data, error: fetchError } = await supabase
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
      .eq("is_active", true)
      .maybeSingle();

    if (fetchError) {
      setError(fetchError);
      console.error(fetchError);
      setActiveRouteIsLoading(false);
      return;
    }

    if (data) {
      setRoutes((prev) => ({ ...prev, [data.id]: data }));
      setActiveRouteId(data.id);
    } else {
      setActiveRouteId(null);
    }
  }

  useEffect(() => {
    fetchActiveRoute();
  }, []);

  useEffect(() => {
    setActiveRouteIsLoading(false);
  }, [routes]);

  const activeRoute = activeRouteId ? routes[activeRouteId] : null;

  return {
    activeRoute,
    activeRouteIsLoading,
    error,
    fetchActiveRoute,
  };
}
