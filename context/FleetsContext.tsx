import React, { createContext, ReactNode, useState, Dispatch, SetStateAction } from "react";
import { Fleet } from "@/types/globalTypes";

export interface FleetsContextType {
  fleets: Record<string, Partial<Fleet>>;
  setFleets: Dispatch<SetStateAction<Record<string, Partial<Fleet>>>>;
}

export const FleetsContext = createContext<FleetsContextType>({
  fleets: {},
  setFleets: () => {},
});

export function FleetsContextProvider({ children }: { children: ReactNode }) {
  const [fleets, setFleets] = useState<Record<string, Partial<Fleet>>>({});

  return <FleetsContext.Provider value={{ fleets, setFleets }}>{children}</FleetsContext.Provider>;
}
