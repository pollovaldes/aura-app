/*
 * _layout.tsx - Created on Sat Jun 29 2024 by Luis Arturo Valdes Romero
 *
 * Copyright (c) 2024 Aura Residuos Sustentables
 */

import { Stack } from "expo-router";
import { useColorScheme } from "react-native";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import "@/style/unistyles";

export const unstable_settings = {
  initialRouteName: "index",
};

export default function Layout() {
  const colorScheme = useColorScheme(); // JUST FOR NATIVE UI

  return (
    // ThemeProvider is only used to automatically adapt native UI elements,
    // like tab bars and headers, to the current theme (dark or light mode).
    // For other components, such as labels, custom navigators or buttons,
    // use Unistyles to apply styles appropriate for dark and light modes.
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(protected)" />
        <Stack.Screen
          name="terms"
          options={{ presentation: "modal", headerShown: false }}
        />
        <Stack.Screen
          name="privacy-policy"
          options={{ presentation: "modal", headerShown: false }}
        />
      </Stack>
    </ThemeProvider>
  );
}
