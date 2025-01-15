import { useEffect, useState } from "react";
import { useRoutes } from "./useRoutes";
import { Route } from "@/types/globalTypes";

export function useActiveRoute() {
  const { getActiveRouteId, refetchRouteById, routes } = useRoutes();
  const [activeRouteId, setActiveRouteId] = useState<string | null>(null);
  const [activeRouteIdIsLoading, setActiveRouteIdIsLoading] = useState(false);
  const [activeRouteIsLoading, setActiveRouteIsLoading] = useState(false);
  const [activeRoute, setActiveRoute] = useState<Route | null>(null);

  useEffect(function fetchActiveRouteDataEffect() {
    async function fetchActiveRouteData() {
      setActiveRouteIdIsLoading(true);
      const activeRouteIdFromDB = await getActiveRouteId();
      setActiveRouteId(activeRouteIdFromDB);
      setActiveRouteIdIsLoading(false);

      if (activeRouteIdFromDB) {
        setActiveRouteIsLoading(true);
        await refetchRouteById(activeRouteIdFromDB);
        setActiveRouteIsLoading(false);
      }
    }
    fetchActiveRouteData();
  }, []);

  useEffect(
    function logRoutesEffect() {
      if (activeRouteId && routes[activeRouteId]) {
        setActiveRoute(routes[activeRouteId]);
      }
    },
    [routes]
  );

  return {
    activeRoute,
    activeRouteIdIsLoading,
    activeRouteIsLoading,
  };
}
