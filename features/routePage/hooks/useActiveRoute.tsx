import { useContext, useEffect, useState } from "react";
import { RoutesContext } from "../context/RoutesContext";
import { supabase } from "@/lib/supabase";
import { PostgrestError } from "@supabase/supabase-js";
import { useSessionContext } from "@/context/SessionContext";

export function useActiveRoute(profileId: string | null | undefined) {
  const { routes, setRoutes, activeRouteId, setActiveRouteId, activeRouteIsLoading, setActiveRouteIsLoading } =
    useContext(RoutesContext);
  const { session, isLoading: isSessionLoading } = useSessionContext();
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

      const myRoute = data.find((r) => r.user_id === session?.user.id);
      if (myRoute) {
        setActiveRouteId(myRoute.id);
      } else {
        setActiveRouteId(null);
      }
    } else {
      setActiveRouteId(null);
    }
  }

  useEffect(() => {
    if (!routes[activeRouteId] && profileId) {
      fetchActiveRoute();
    }
  }, [session, profileId]);

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
