// AccentThemeContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { ThemeProvider } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme } from "react-native";

import { darkTheme, lightTheme } from "@/style/themes";
import { ACCENT_COLORS, AccentColorName } from "@/style/accentColor";

// ---- Types ----

interface AccentThemeContextProps {
  accentColor: AccentColorName;
  setAccentColor: (color: AccentColorName) => void;
}

// This is the shape of the context we will provide.
const AccentThemeContext = createContext<AccentThemeContextProps>({
  accentColor: "blue", // default
  setAccentColor: () => {},
});

// You can export this hook to consume the context anywhere in your app.
export const useAccentTheme = (): AccentThemeContextProps => {
  return useContext(AccentThemeContext);
};

// Storage key to read/write user’s accent preference
const ACCENT_STORAGE_KEY = "user_accent_color";

// The provider that encloses the @react-navigation/native ThemeProvider
export const AccentThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const colorScheme = useColorScheme();
  const [accentColor, setAccentColorState] = useState<AccentColorName>("blue");

  // Read from local storage on mount
  useEffect(() => {
    const loadAccentColor = async () => {
      try {
        const storedColor = await AsyncStorage.getItem(ACCENT_STORAGE_KEY);
        if (storedColor && Object.keys(ACCENT_COLORS).includes(storedColor)) {
          setAccentColorState(storedColor as AccentColorName);
        }
      } catch (error) {
        console.warn("Failed to load accent color from storage:", error);
      }
    };

    loadAccentColor();
  }, []);

  // A wrapper to set and persist accent color
  const setAccentColor = async (color: AccentColorName) => {
    try {
      await AsyncStorage.setItem(ACCENT_STORAGE_KEY, color);
    } catch (error) {
      console.warn("Failed to save accent color to storage:", error);
    }
    setAccentColorState(color);
  };

  // Merge base theme (light/dark) with accent color
  const baseTheme = colorScheme === "dark" ? darkTheme.ui : lightTheme.ui;
  const accentHex = ACCENT_COLORS[accentColor][colorScheme === "dark" ? "dark" : "light"];

  // currentTheme with the accent color overriding `primary`
  const currentTheme = {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      primary: accentHex,
    },
  };

  return (
    <AccentThemeContext.Provider value={{ accentColor, setAccentColor }}>
      {/**
       * We must not replace or rename the `ThemeProvider` from
       * `@react-navigation/native`. We just feed it our newly
       * combined theme object.
       */}
      <ThemeProvider value={currentTheme}>{children}</ThemeProvider>
    </AccentThemeContext.Provider>
  );
};
