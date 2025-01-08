import { Route } from "@/types/globalTypes";
import { createContext, Dispatch, ReactNode, SetStateAction, useState } from "react";

export interface RoutesContextType {
  routes: Route[] | null;
  setRoutes: Dispatch<SetStateAction<Route[] | null>>;
  hasAnActiveRoute:
    | {
        hasActiveRoute: boolean;
        activeRoute: Route;
      }
    | {
        hasActiveRoute: false;
        activeRoute: null;
      };
  setHasAnActiveRoute: Dispatch<
    SetStateAction<
      | {
          hasActiveRoute: boolean;
          activeRoute: Route;
        }
      | {
          hasActiveRoute: false;
          activeRoute: null;
        }
    >
  >;
}

const RoutesContext = createContext<RoutesContextType>({
  routes: null,
  setRoutes: (() => {}) as Dispatch<SetStateAction<Route[] | null>>,
  hasAnActiveRoute: {
    hasActiveRoute: false,
    activeRoute: null,
  },
  setHasAnActiveRoute: (() => {}) as Dispatch<
    SetStateAction<
      | {
          hasActiveRoute: boolean;
          activeRoute: Route;
        }
      | {
          hasActiveRoute: false;
          activeRoute: null;
        }
    >
  >,
});

interface RoutesContextProviderProps {
  children: ReactNode;
}

export function RoutesContextProvider({ children }: RoutesContextProviderProps) {
  const [routes, setRoutes] = useState<Route[] | null>(null);
  const [hasAnActiveRoute, setHasAnActiveRoute] = useState<
    | {
        hasActiveRoute: boolean;
        activeRoute: Route;
      }
    | {
        hasActiveRoute: false;
        activeRoute: null;
      }
  >({
    hasActiveRoute: false,
    activeRoute: null,
  });

  return (
    <RoutesContext.Provider
      value={{
        routes,
        setRoutes,
        hasAnActiveRoute,
        setHasAnActiveRoute,
      }}
    >
      {children}
    </RoutesContext.Provider>
  );
}
