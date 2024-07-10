/*
 * _layout.tsx - Created on Sat Jun 29 2024 by Luis Arturo Valdes Romero
 *
 * Copyright (c) 2024 Aura Residuos Sustentables
 */

import { Stack } from "expo-router";
import { Platform, Text, useColorScheme, View } from "react-native";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import "@/style/unistyles";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import AuraLogo from "@/components/web-logo-title/AuraLogo";
import CustomWebHeader from "./CustomWebHeader";

export default function Layout() {
  const colorScheme = useColorScheme(); // JUST FOR NATIVE UI

  return (
    // ThemeProvider is only used to automatically adapt native UI elements,
    // like tab bars and headers, to the current theme (dark or light mode).
    // For other components, such as labels, custom navigators or buttons,
    // use Unistyles to apply styles appropriate for dark and light modes.
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          headerShown: Platform.OS === "web" ? true : false,
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="auth-flow"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="traditional-auth"
          options={{ presentation: "modal", headerShown: false }}
        />
        <Stack.Screen
          name="(protected)"
          options={{
            header: () => <CustomWebHeader />,
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}
