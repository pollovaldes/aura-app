// _layout.tsx
import React from "react";
import { Stack } from "expo-router";
import { Platform } from "react-native";
import { SearchProvider, useSearch } from "@/context/SearchContext";

export const unstable_settings = {
  initialRouteName: "index",
};

export default function Layout() {
  return (
    <SearchProvider>
      <SearchConsumer />
    </SearchProvider>
  );
}

function SearchConsumer() {
  const { setSearchQuery } = useSearch(); // Usa el contexto de búsqueda aquí

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerLargeTitle: true,
        headerBlurEffect: "regular",
        headerTransparent: Platform.OS === "ios" ? true : false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Vehículos",
          headerSearchBarOptions: {
            placeholder: "Buscar por nombre, placa o num. económico",
            hideWhenScrolling: false,
            onChangeText: (event) =>
              setSearchQuery("trucks", event.nativeEvent.text), // Actualiza la búsqueda en el contexto
          },
        }}
      />
    </Stack>
  );
}
