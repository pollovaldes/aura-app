/*
 * _layout.tsx - Created on Sat Jun 29 2024 by Luis Arturo Valdes Romero
 *
 * Copyright (c) 2024 Aura Residuos Sustentables
 */

import { Stack } from "expo-router";
import { Platform, useColorScheme } from "react-native";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import "@/style/unistyles";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import AuraLogo from "@/components/web-logo-title/AuraLogo";

export default function Layout() {
  const colorScheme = useColorScheme(); // JUST FOR NATIVE UI
  const { styles } = useStyles(stylesheet); // FOR THEMING OTHER COMPONENTS

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
          name="(protected)"
          options={{
            headerTitle: () => (
              <AuraLogo width={120} height={40} fill={styles.logo.color} />
            ),
            headerStyle: {
              backgroundColor: styles.headerBackgroundColor.backgroundColor,
            },
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  headerBackgroundColor: {
    backgroundColor: theme.colors.backgroundTertiary,
  },
  logo: {
    color: theme.colors.inverted,
  },
}));
