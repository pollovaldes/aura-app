// accentColors.ts
export type AccentColorName = "blue" | "purple" | "pink" | "red" | "orange" | "yellow" | "green" | "grey";

interface AccentColorSet {
  light: string;
  dark: string;
}

// Official Apple color references for iOS (adjust as needed):
export const ACCENT_COLORS: Record<AccentColorName, AccentColorSet> = {
  blue: {
    light: "#007AFF",
    dark: "#0A84FF",
  },
  purple: {
    light: "#5856D6",
    dark: "#5E5CE6",
  },
  pink: {
    light: "#FF2D55",
    dark: "#FF375F",
  },
  red: {
    light: "#FF3B30",
    dark: "#FF453A",
  },
  orange: {
    light: "#FF9500",
    dark: "#FF9F0A",
  },
  yellow: {
    light: "#FFCC00",
    dark: "#FFD60A",
  },
  green: {
    light: "#34C759",
    dark: "#32D74B",
  },
  grey: {
    light: "#8E8E93",
    dark: "#8E8E93",
  },
};
