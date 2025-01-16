import { Route } from "@/types/globalTypes";
import { createContext, ReactNode, useState } from "react";

type RoutesDictionary = Record<string, Route>;

export interface RoutesContextType {
  routes: RoutesDictionary;
  setRoutes: React.Dispatch<React.SetStateAction<RoutesDictionary>>;
  activeRouteId: string | null;
  setActiveRouteId: React.Dispatch<React.SetStateAction<string | null>>;
  activeRouteIsLoading: boolean;
  setActiveRouteIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const RoutesContext = createContext<RoutesContextType>({
  routes: {},
  setRoutes: () => {},
  activeRouteId: null,
  setActiveRouteId: () => {},
  activeRouteIsLoading: false,
  setActiveRouteIsLoading: () => {},
});

export function RoutesContextProvider({ children }: { children: ReactNode }) {
  const [routes, setRoutes] = useState<RoutesDictionary>({});
  const [activeRouteId, setActiveRouteId] = useState<string | null>(null);
  const [activeRouteIsLoading, setActiveRouteIsLoading] = useState<boolean>(false);

  return (
    <RoutesContext.Provider
      value={{
        routes,
        setRoutes,
        activeRouteId,
        setActiveRouteId,
        activeRouteIsLoading,
        setActiveRouteIsLoading,
      }}
    >
      {children}
    </RoutesContext.Provider>
  );
}
