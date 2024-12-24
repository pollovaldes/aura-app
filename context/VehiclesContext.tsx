import { createContext, ReactNode, useState, Dispatch, SetStateAction } from "react";
import { Vehicle, VehicleThumbnail } from "@/types/globalTypes";

export interface VehiclesContextType {
  vehicles: Vehicle[] | null;
  setVehicles: Dispatch<SetStateAction<Vehicle[] | null>>;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  hasMorePages: boolean;
  setHasMorePages: Dispatch<SetStateAction<boolean>>;
  vehicleThumbnails: VehicleThumbnail[];
  setVehicleThumbnails: Dispatch<SetStateAction<VehicleThumbnail[]>>;
}

const VehiclesContext = createContext<VehiclesContextType>({
  vehicles: null,
  setVehicles: (() => {}) as Dispatch<SetStateAction<Vehicle[] | null>>,
  currentPage: 1,
  setCurrentPage: (() => {}) as Dispatch<SetStateAction<number>>,
  hasMorePages: true,
  setHasMorePages: (() => {}) as Dispatch<SetStateAction<boolean>>,
  vehicleThumbnails: [],
  setVehicleThumbnails: (() => {}) as Dispatch<SetStateAction<VehicleThumbnail[]>>,
});

interface VehiclesContextProviderProps {
  children: ReactNode;
}

export function VehiclesContextProvider({ children }: VehiclesContextProviderProps) {
  const [vehicles, setVehicles] = useState<Vehicle[] | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMorePages, setHasMorePages] = useState(true);
  const [vehicleThumbnails, setVehicleThumbnails] = useState<VehicleThumbnail[]>([]);

  return (
    <VehiclesContext.Provider
      value={{
        vehicles,
        setVehicles,
        currentPage,
        setCurrentPage,
        hasMorePages,
        setHasMorePages,
        vehicleThumbnails,
        setVehicleThumbnails,
      }}
    >
      {children}
    </VehiclesContext.Provider>
  );
}

export default VehiclesContext;
