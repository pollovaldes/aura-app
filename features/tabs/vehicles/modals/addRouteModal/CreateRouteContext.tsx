import { TablesInsert } from "@/types/database.types";
import React, { createContext, useContext, useState } from "react";

type RouteInsertType = TablesInsert<"routes">;

interface CreateRouteContextValue {
  routeData: Partial<RouteInsertType>;
  setField<K extends keyof RouteInsertType>(field: K, value: RouteInsertType[K]): void;
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  resetForm(): void;
  close(): void;
}

const CreateRouteContext = createContext<CreateRouteContextValue | null>(null);

interface CreateRouteProviderProps {
  children: React.ReactNode;
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  close: () => void;
}

export const CreateRouteProvider: React.FC<CreateRouteProviderProps> = ({ children, step, setStep, close }) => {
  const [routeData, setRouteData] = useState<Partial<RouteInsertType>>({});

  const setField: CreateRouteContextValue["setField"] = (field, value) => {
    setRouteData((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => setRouteData({});

  return (
    <CreateRouteContext.Provider value={{ routeData, setField, resetForm, setStep, step, close }}>
      {children}
    </CreateRouteContext.Provider>
  );
};

export function useCreateRoute() {
  const context = useContext(CreateRouteContext);
  if (!context) {
    throw new Error("useCreateRoute must be used within a CreateRouteProvider");
  }
  return context;
}
