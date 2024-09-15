import { Truck } from "@/hooks/truckHooks/useTruck";
import {
  createContext,
  ReactNode,
  useState,
  Dispatch,
  SetStateAction,
} from "react";

// Define the type for the context value
interface TrucksContextType {
  trucks: Truck[];
  setTrucks: Dispatch<SetStateAction<Truck[]>>;
}

// Create the context with a default value
const Context = createContext<TrucksContextType | undefined>(undefined);

interface TrucksContextProviderProps {
  children: ReactNode;
}

export function TrucksContextProvider({
  children,
}: TrucksContextProviderProps) {
  const [trucks, setTrucks] = useState<Truck[]>([]);

  return (
    <Context.Provider value={{ trucks, setTrucks }}>
      {children}
    </Context.Provider>
  );
}

export default Context;
