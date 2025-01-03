import { useState, useEffect } from "react";
import { UnistylesRuntime } from "react-native-unistyles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ACCENT_COLORS, AccentColorName } from "@/style/accentColor";

const ACCENT_COLOR_STORAGE_KEY = "USER_SELECTED_ACCENT_COLOR";

export function useAccentColor() {
  const [accentColor, setAccentColor] = useState<AccentColorName>("blue");

  useEffect(() => {
    async function loadAccentColor() {
      try {
        const storedColor = await AsyncStorage.getItem(ACCENT_COLOR_STORAGE_KEY);
        if (storedColor && ACCENT_COLORS[storedColor as AccentColorName]) {
          setAccentColor(storedColor as AccentColorName);
        }
      } catch (error) {
        console.error("Failed to load accent color:", error);
      }
    }
    loadAccentColor();
  }, []);

  useEffect(() => {
    applyAccentColor(accentColor);
  }, [accentColor]);

  async function applyAccentColor(colorName: AccentColorName) {
    try {
      UnistylesRuntime.updateTheme("light", (currentTheme) => ({
        ...currentTheme,
        ui: {
          ...currentTheme.ui,
          colors: {
            ...currentTheme.ui.colors,
            primary: ACCENT_COLORS[colorName].light,
          },
        },
      }));

      UnistylesRuntime.updateTheme("dark", (currentTheme) => ({
        ...currentTheme,
        ui: {
          ...currentTheme.ui,
          colors: {
            ...currentTheme.ui.colors,
            primary: ACCENT_COLORS[colorName].dark,
          },
        },
      }));

      await AsyncStorage.setItem(ACCENT_COLOR_STORAGE_KEY, colorName);
    } catch (error) {
      console.error("Failed to apply accent color:", error);
    }
  }

  function handleColorPress(colorName: AccentColorName) {
    setAccentColor(colorName);
  }

  return {
    accentColor,
    setAccentColor,
    handleColorPress,
  };
}
