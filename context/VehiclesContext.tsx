import { Database } from "@/types/database.types";
import { createContext, ReactNode, useState, Dispatch, SetStateAction } from "react";

type Vehicle = Database["public"]["Tables"]["vehicles"]["Row"];

interface VehiclesContextType {
  vehicles: Vehicle[] | null;
  setVehicles: Dispatch<SetStateAction<Vehicle[] | null>>;
  vehiclesAreLoading: boolean;
  setVehiclesAreLoading: Dispatch<SetStateAction<boolean>>;
}

const VehiclesContext = createContext<VehiclesContextType>({
  vehicles: null,
  setVehicles: (() => {}) as Dispatch<SetStateAction<Vehicle[] | null>>,
  vehiclesAreLoading: true,
  setVehiclesAreLoading: (() => {}) as Dispatch<SetStateAction<boolean>>,
});

interface VehiclesContextProviderProps {
  children: ReactNode;
}

export function VehiclesContextProvider({ children }: VehiclesContextProviderProps) {
  const [vehicles, setVehicles] = useState<Vehicle[] | null>(null);
  const [vehiclesAreLoading, setVehiclesAreLoading] = useState<boolean>(false);

  return (
    <VehiclesContext.Provider
      value={{
        vehicles,
        setVehicles,
        vehiclesAreLoading,
        setVehiclesAreLoading,
      }}
    >
      {children}
    </VehiclesContext.Provider>
  );
}

export default VehiclesContext;
