import { supabase } from "@/lib/supabase";
import { BreakEvent, EmergencyEvent, OtherEvent, RefuelingEvent, Route, RouteEvent } from "@/types/globalTypes";
import { useEffect, useState } from "react";

export function useRoutes(routeId?: string) {
  const [routes, setRoutes] = useState<Route[] | null>(null);
  const [areRoutesLoading, setAreRoutesLoading] = useState<boolean>(false);

  const fetchRoutes = async () => {
    setAreRoutesLoading(true);

    let query = supabase.from("routes").select(`
      *,
      route_events (*),
      break_events (*),
      emergency_events (*),
      other_events (*),
      refueling_events (*)
    `);

    if (routeId) {
      query = query.eq("id", routeId);
    }

    const { data, error } = await query;

    if (error) {
      console.error(
        `Error fetching route records: \n\n` +
          `Message: ${error.message}\n\n` +
          `Code: ${error.code}\n\n` +
          `Details: ${error.details}\n\n` +
          `Hint: ${error.hint}`
      );
      setAreRoutesLoading(false);
      setRoutes(null);
      return;
    }

    const normalizedRoutes: Route[] = data.map((route) => {
      const routeEvents = (route.route_events || []) as RouteEvent[];
      const breakEvents = (route.break_events || []) as BreakEvent[];
      const emergencyEvents = (route.emergency_events || []) as EmergencyEvent[];
      const otherEvents = (route.other_events || []) as OtherEvent[];
      const refuelingEvents = (route.refueling_events || []) as RefuelingEvent[];

      return {
        ...route,
        routeEvents,
        breakEvents,
        emergencyEvents,
        otherEvents,
        refuelingEvents,
      };
    });

    setRoutes(normalizedRoutes);
    setAreRoutesLoading(false);
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  return { routes, areRoutesLoading, fetchRoutes };
}
