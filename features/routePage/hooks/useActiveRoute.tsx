import { useEffect, useState } from "react";
import { useRoutes } from "./useRoutes";

export function useActiveRoute() {
  const { getActiveRouteId, fetchRouteById, routes, activeRouteId, setActiveRouteId } = useRoutes();
  const [activeRouteIdIsLoading, setActiveRouteIdIsLoading] = useState(false);
  const [activeRouteIsLoading, setActiveRouteIsLoading] = useState(false);

  useEffect(() => {
    async function fetchActiveRouteData() {
      if (!activeRouteId) {
        setActiveRouteIdIsLoading(true);
        const activeRouteIdFromDB = await getActiveRouteId();
        setActiveRouteId(activeRouteIdFromDB);
        setActiveRouteIdIsLoading(false);

        if (activeRouteIdFromDB) {
          setActiveRouteIsLoading(true);
          await fetchRouteById(activeRouteIdFromDB);
          setActiveRouteIsLoading(false);
        }
      }
    }

    fetchActiveRouteData();
  }, []);

  const activeRoute = activeRouteId ? routes[activeRouteId] : null;

  return {
    activeRouteIdIsLoading,
    activeRouteIsLoading,
    activeRouteId,
    activeRoute,
    routes,
  };
}
