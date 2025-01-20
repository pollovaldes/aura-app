import { RouteEventWithEvents } from "@/types/globalTypes";
import React, { createContext, useState, Dispatch } from "react";

export interface StopsContextType {
  currentStop: Partial<RouteEventWithEvents> | null;
  setCurrentStop: Dispatch<React.SetStateAction<Partial<RouteEventWithEvents> | null>>;
}

export const StopsContext = createContext<StopsContextType>({
  currentStop: null,
  setCurrentStop: () => {},
});

export function StopsContextProvider({ children }: { children: React.ReactNode }) {
  const [currentStop, setCurrentStop] = useState<Partial<RouteEventWithEvents> | null>(null);

  return (
    <StopsContext.Provider
      value={{
        currentStop,
        setCurrentStop,
      }}
    >
      {children}
    </StopsContext.Provider>
  );
}
