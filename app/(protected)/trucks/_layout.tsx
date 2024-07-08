/*
 * index.tsx - Created on Mon Jun 24 2024 by Luis Arturo Valdes Romero
 *
 * Copyright (c) 2024 Aura Residuos Sustentables
 */

import React from "react";
import { Stack } from "expo-router";

// Ensures the back button works after a page reload or deep link navigation.
export const unstable_settings = {
  initialRouteName: "index",
};

export default function _layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerLargeTitle: true,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Camiones",
          headerSearchBarOptions: {
            placeholder: "Buscar",
          },
        }}
      />
      <Stack.Screen
        name="documents"
        options={{ title: "Documentos", headerLargeTitle: false }}
      />
    </Stack>
  );
}
