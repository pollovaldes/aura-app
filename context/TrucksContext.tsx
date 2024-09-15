import { Truck } from "@/types/Truck";
import {
  createContext,
  ReactNode,
  useState,
  Dispatch,
  SetStateAction,
} from "react";

interface TrucksContextType {
  trucks: Truck[] | null; // Allow null or Truck[]
  setTrucks: Dispatch<SetStateAction<Truck[] | null>>; // Update setTrucks accordingly
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}

const Context = createContext<TrucksContextType | undefined>(undefined);

interface TrucksContextProviderProps {
  children: ReactNode;
}

export function TrucksContextProvider({
  children,
}: TrucksContextProviderProps) {
  const [trucks, setTrucks] = useState<Truck[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  return (
    <Context.Provider value={{ trucks, setTrucks, isLoading, setIsLoading }}>
      {children}
    </Context.Provider>
  );
}

export default Context;
