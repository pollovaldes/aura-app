export type AccentColorName =
  | "blue"
  | "red"
  | "orange"
  | "yellow"
  | "green"
  | "teal"
  | "indigo"
  | "purple"
  | "brown"
  | "gray"
  | "cyan"
  | "pink"
  | "lime"
  | "gold"
  | "peach"
  | "crimson";

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
  red: {
    light: "#eb4e3d",
    dark: "#eb5545",
  },
  orange: {
    light: "#f19a37",
    dark: "#f2a33c",
  },
  yellow: {
    light: "#f7ce46",
    dark: "#f9d84a",
  },
  green: {
    light: "#63ca56",
    dark: "#6bd45f",
  },
  teal: {
    light: "#6eabc1",
    dark: "#80c2d9",
  },
  indigo: {
    light: "#5856cf",
    dark: "#5e5cde",
  },
  purple: {
    light: "#a357d7",
    dark: "#b260ea",
  },
  brown: {
    light: "#9d8563",
    dark: "#a78f6d",
  },
  gray: {
    light: "#8e8e93",
    dark: "#98989d",
  },
  cyan: {
    light: "#4cb4d9",
    dark: "#5fc8ed",
  },
  pink: {
    light: "#ff5e8a",
    dark: "#ff7098",
  },
  lime: {
    light: "#b7e046",
    dark: "#c4ea5b",
  },
  gold: {
    light: "#f5c242",
    dark: "#f7cc51",
  },
  peach: {
    light: "#f4a783",
    dark: "#f6b291",
  },
  crimson: {
    light: "#d5465b",
    dark: "#e15767",
  },
};
