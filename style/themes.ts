import { Platform } from "react-native";

export const lightTheme = {
  colors: {
    text: {
      main: "#1c1c1e",
      mainInverted: "#e5e5e7",
      subtitle: "#8a8a8e",
    },
    brands: {
      inverted: "#000000",
      phone: "#3478f6",
    },
    backgroundMain: "#ffffff",
    backgroundSecondary: "#fafafa",
    backgroundTertiary: "#f5f5f7",
    backgroundSelected: "#e7e7e9",
    outline: "#d8d8d8",
    inverted: "#000000",
    primary: "#3478f6",
    imageOverlay: "rgba(0,0,0, 0.15)",
  },
  margins: {
    sm: 2,
    md: 4,
    lg: 8,
    xl: 12,
  },
} as const;

export const darkTheme = {
  colors: {
    text: {
      main: "#e5e5e7",
      mainInverted: "#1c1c1e",
      subtitle: "#98989e",
    },
    brands: {
      inverted: "#ffffff",
      phone: "#7ab6ff",
    },
    backgroundMain: "#000000",
    backgroundSecondary: "#0d0d0d",
    backgroundTertiary: "#141414",
    backgroundSelected: "#181816",
    outline: "#272729",
    inverted: "#ffffff",
    primary: "#3b82f7",
    imageOverlay: "rgba(0,0,0, 0.45)",
  },
  margins: {
    sm: 2,
    md: 4,
    lg: 8,
    xl: 12,
  },
} as const;
