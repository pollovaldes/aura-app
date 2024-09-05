// SearchContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";

interface SearchState {
  [key: string]: string; // Cada búsqueda tendrá un identificador único y un término de búsqueda asociado
}

interface SearchContextProps {
  searchState: SearchState;
  setSearchQuery: (id: string, query: string) => void;
  clearSearchQuery: (id: string) => void;
}

// Crear el contexto de búsqueda
const SearchContext = createContext<SearchContextProps | undefined>(undefined);

interface SearchProviderProps {
  children: ReactNode;
}

// Proveedor del contexto de búsqueda
export function SearchProvider({ children }: SearchProviderProps) {
  const [searchState, setSearchState] = useState<SearchState>({});

  // Función para establecer el término de búsqueda para un buscador específico
  const setSearchQuery = (id: string, query: string) => {
    setSearchState((prevState) => ({
      ...prevState,
      [id]: query,
    }));
  };

  // Función para limpiar el término de búsqueda para un buscador específico
  const clearSearchQuery = (id: string) => {
    setSearchState((prevState) => {
      const newState = { ...prevState };
      delete newState[id];
      return newState;
    });
  };

  return (
    <SearchContext.Provider value={{ searchState, setSearchQuery, clearSearchQuery }}>
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
