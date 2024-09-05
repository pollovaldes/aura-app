import React, { createContext, useContext, useState, ReactNode } from "react";

// Define la interfaz para el contexto de búsqueda
interface SearchContextProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

// Inicializa el contexto con valores predeterminados
const SearchContext = createContext<SearchContextProps | undefined>(undefined);

// Define las props para el proveedor del contexto
interface SearchProviderProps {
  children: ReactNode; // 'children' se tipa como ReactNode
}

// Proveedor del contexto de búsqueda
export function SearchProvider({ children }: SearchProviderProps) {
  const [searchQuery, setSearchQuery] = useState<string>("");

  return (
    <SearchContext.Provider value={{ searchQuery, setSearchQuery }}>
      {children}
    </SearchContext.Provider>
  );
}

// Hook personalizado para usar el contexto de búsqueda
export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch debe usarse dentro de un SearchProvider");
  }
  return context;
}
