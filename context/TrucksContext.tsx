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
  trucksAreLoading: boolean;
  setTrucksAreLoading: Dispatch<SetStateAction<boolean>>;
  thumbanilIsLoading: boolean;
  setThumbnailIsLoading: Dispatch<SetStateAction<boolean>>;
}

const Context = createContext<TrucksContextType | undefined>(undefined);

interface TrucksContextProviderProps {
  children: ReactNode;
}

export function TrucksContextProvider({
  children,
}: TrucksContextProviderProps) {
  const [trucks, setTrucks] = useState<Truck[] | null>(null);
  const [trucksAreLoading, setTrucksAreLoading] = useState<boolean>(true);
  const [thumbanilIsLoading, setThumbnailIsLoading] = useState<boolean>(false);

  return (
    <Context.Provider
      value={{
        trucks,
        setTrucks,
        trucksAreLoading: trucksAreLoading,
        setTrucksAreLoading: setTrucksAreLoading,
        thumbanilIsLoading: thumbanilIsLoading,
        setThumbnailIsLoading: setThumbnailIsLoading,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export default Context;
