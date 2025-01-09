import { Route } from "@/types/globalTypes";
import { createContext, Dispatch, ReactNode, SetStateAction, useState } from "react";

export interface RoutesContextType {
  routes: Record<string, Route>;
  setRoutes: Dispatch<SetStateAction<Record<string, Route>>>;
  activeRoue: Route | null;
  setActiveRoute: Dispatch<SetStateAction<Route | null>>;
}

export const RoutesContext = createContext<RoutesContextType>({
  routes: {},
  setRoutes: () => {},
  activeRoue: null,
  setActiveRoute: () => {},
});

export function RoutesContextProvider({ children }: { children: ReactNode }) {
  const [routes, setRoutes] = useState<Record<string, Route>>({});
  const [activeRoue, setActiveRoute] = useState<Route | null>(null);

  return (
    <RoutesContext.Provider
      value={{
        routes,
        setRoutes,
        activeRoue,
        setActiveRoute,
      }}
    >
      {children}
    </RoutesContext.Provider>
  );
}
