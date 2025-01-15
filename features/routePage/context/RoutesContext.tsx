import { Route } from "@/types/globalTypes";
import { createContext, Dispatch, ReactNode, SetStateAction, useState } from "react";

export interface RoutesContextType {
  routes: Record<string, Route>;
  setRoutes: Dispatch<SetStateAction<Record<string, Route>>>;
  activeRouteId: string | null;
  setActiveRouteId: Dispatch<SetStateAction<string | null>>;
}

export const RoutesContext = createContext<RoutesContextType>({
  routes: {},
  setRoutes: () => {},
  activeRouteId: null,
  setActiveRouteId: () => {},
});

export function RoutesContextProvider({ children }: { children: ReactNode }) {
  const [routes, setRoutes] = useState<Record<string, Route>>({});
  const [activeRouteId, setActiveRouteId] = useState<string | null>(null);

  return (
    <RoutesContext.Provider
      value={{
        routes,
        setRoutes,
        activeRouteId,
        setActiveRouteId,
      }}
    >
      {children}
    </RoutesContext.Provider>
  );
}
