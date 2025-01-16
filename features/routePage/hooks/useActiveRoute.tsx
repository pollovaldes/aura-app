import { useContext, useEffect, useState } from "react";
import { RoutesContext } from "../context/RoutesContext";
import { supabase } from "@/lib/supabase";
import { PostgrestError } from "@supabase/supabase-js";

export function useActiveRoute(profileId: string | null | undefined) {
  const { routes, setRoutes, activeRouteId, setActiveRouteId, activeRouteIsLoading, setActiveRouteIsLoading } =
    useContext(RoutesContext);
  const [error, setError] = useState<PostgrestError | null>(null);

  async function fetchActiveRouteIdStandalone(routeId: string) {
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
      .eq("id", routeId);

    if (fetchError) {
      setError(fetchError);
      console.error(fetchError);
      return;
    }

    if (data) {
      setRoutes((prev) => ({ ...prev, [data[0].id]: data[0] }));
    }
  }

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
      .eq("is_active", true);

    if (fetchError) {
      setError(fetchError);
      console.error(fetchError);
      setActiveRouteIsLoading(false);
      return;
    }

    if (data && data.length > 0) {
      setRoutes((prev) => {
        const updated = { ...prev };
        data.forEach((route) => {
          updated[route.id] = route;
        });
        return updated;
      });

      const myRoute = data.find((r) => r.user_id === profileId);
      if (myRoute) {
        setActiveRouteId(myRoute.id);
      } else {
        setActiveRouteId(null);
      }
    } else {
      setActiveRouteId(null);
      setActiveRouteIsLoading(false);
    }

    setActiveRouteIsLoading(false);
  }

  useEffect(() => {
    if ((!routes[activeRouteId!] && profileId) || (activeRouteId && !routes[activeRouteId!])) {
      fetchActiveRoute();
    }
  }, [profileId]);

  useEffect(() => {
    if (!routes[activeRouteId!] && profileId) {
      setActiveRouteIsLoading(false);
    }
  }, [routes]);

  const activeRoute = activeRouteId ? routes[activeRouteId] : null;

  return {
    activeRoute,
    activeRouteIsLoading,
    error,
    fetchActiveRoute,
    setActiveRouteId,
    fetchActiveRouteIdStandalone,
  };
}
