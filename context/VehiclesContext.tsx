import React, { createContext, ReactNode, useState, Dispatch, SetStateAction } from "react";
import { Vehicle, VehicleThumbnail } from "@/types/globalTypes";

export interface VehiclesContextType {
  vehicles: Record<string, Vehicle>;
  setVehicles: Dispatch<SetStateAction<Record<string, Vehicle>>>;
  vehicleThumbnails: VehicleThumbnail[];
  setVehicleThumbnails: Dispatch<SetStateAction<VehicleThumbnail[]>>;
}

export const VehiclesContext = createContext<VehiclesContextType>({
  vehicles: {},
  setVehicles: () => {},
  vehicleThumbnails: [],
  setVehicleThumbnails: () => {},
});

export function VehiclesContextProvider({ children }: { children: ReactNode }) {
  const [vehicles, setVehicles] = useState<Record<string, Vehicle>>({});
  const [vehicleThumbnails, setVehicleThumbnails] = useState<VehicleThumbnail[]>([]);

  return (
    <VehiclesContext.Provider
      value={{
        vehicles,
        setVehicles,
        vehicleThumbnails,
        setVehicleThumbnails,
      }}
    >
      {children}
    </VehiclesContext.Provider>
  );
}
