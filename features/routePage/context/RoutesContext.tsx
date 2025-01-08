import { Route } from "@/types/globalTypes";
import { createContext, Dispatch, ReactNode, SetStateAction, useState } from "react";

export interface RoutesContextType {
  routes: Route[] | null;
  setRoutes: Dispatch<SetStateAction<Route[] | null>>;
}

const RoutesContext = createContext<RoutesContextType>({
  routes: null,
  setRoutes: (() => {}) as Dispatch<SetStateAction<Route[] | null>>,
});

interface RoutesContextProviderProps {
  children: ReactNode;
}

export function RoutesContextProvider({ children }: RoutesContextProviderProps) {
  const [routes, setRoutes] = useState<Route[] | null>(null);

  return (
    <RoutesContext.Provider
      value={{
        routes,
        setRoutes,
      }}
    >
      {children}
    </RoutesContext.Provider>
  );
}
