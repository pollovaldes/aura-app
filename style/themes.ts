import { Platform } from "react-native";
import { fonts } from "@react-navigation/native/src/theming/fonts";

export const colorPalette = {
  neutral: {
    "50": "#fafafa",
    "100": "#f5f5f5",
    "200": "#e5e5e5",
    "300": "#d4d4d4",
    "400": "#a3a3a3",
    "500": "#737373",
    "600": "#525252",
    "700": "#404040",
    "800": "#262626",
    "900": "#171717",
    "950": "#0a0a0a",
  },
  sky: {
    "50": "#f0f9ff",
    "100": "#e0f2fe",
    "200": "#bae6fd",
    "300": "#7dd3fc",
    "400": "#38bdf8",
    "500": "#0ea5e9",
    "600": "#0284c7",
    "700": "#0369a1",
    "800": "#075985",
    "900": "#0c4a6e",
    "950": "#082f49",
  },
  red: {
    "50": "#fef2f2",
    "100": "#fee2e2",
    "200": "#fecaca",
    "300": "#fca5a5",
    "400": "#f87171",
    "500": "#ef4444",
    "600": "#dc2626",
    "700": "#b91c1c",
    "800": "#991b1b",
    "900": "#7f1d1d",
    "950": "#450a0a",
  },
  cyan: {
    "50": "#ecfeff",
    "100": "#cffafe",
    "200": "#a5f3fc",
    "300": "#67e8f9",
    "400": "#22d3ee",
    "500": "#06b6d4",
    "600": "#0891b2",
    "700": "#0e7490",
    "800": "#155e75",
    "900": "#164e63",
    "950": "#083344",
  },
  emerald: {
    "50": "#ecfdf5",
    "100": "#d1fae5",
    "200": "#a7f3d0",
    "300": "#6ee7b7",
    "400": "#34d399",
    "500": "#10b981",
    "600": "#059669",
    "700": "#047857",
    "800": "#065f46",
    "900": "#064e3b",
    "950": "#022c22",
  },
  green: {
    "50": "#f0fdf4",
    "100": "#dcfce7",
    "200": "#bbf7d0",
    "300": "#86efac",
    "400": "#4ade80",
    "500": "#22c55e",
    "600": "#16a34a",
    "700": "#15803d",
    "800": "#166534",
    "900": "#14532d",
    "950": "#052e16",
  },
  lime: {
    "50": "#f7fee7",
    "100": "#ecfccb",
    "200": "#d9f99d",
    "300": "#bef264",
    "400": "#a3e635",
    "500": "#84cc16",
    "600": "#65a30d",
    "700": "#4d7c0f",
    "800": "#3f6212",
    "900": "#365314",
    "950": "#1a2e05",
  },
  orange: {
    "50": "#fff7ed",
    "100": "#ffedd5",
    "200": "#fed7aa",
    "300": "#fdba74",
    "400": "#fb923c",
    "500": "#f97316",
    "600": "#ea580c",
    "700": "#c2410c",
    "800": "#9a3412",
    "900": "#7c2d12",
    "950": "#431407",
  },
  yellow: {
    "50": "#fefce8",
    "100": "#fef9c3",
    "200": "#fef08a",
    "300": "#fde047",
    "400": "#facc15",
    "500": "#eab308",
    "600": "#ca8a04",
    "700": "#a16207",
    "800": "#854d0e",
    "900": "#713f12",
    "950": "#422006",
  },
};

export const lightTheme = {
  ui: {
    dark: false,
    colors: {
      primary: "rgb(0, 122, 255)",
      background: "rgb(242, 242, 242)",
      card: "rgb(255, 255, 255)",
      text: "rgb(28, 28, 30)",
      border: "rgb(216, 216, 216)",
      notification: "rgb(255, 59, 48)",
    },
    fonts,
  },
  colors: {
    inverted: "#000000",
  },
  textPresets: {
    main: colorPalette.neutral[900],
    inverted: colorPalette.neutral[100],
    subtitle: colorPalette.neutral[600],
    link: colorPalette.sky[500],
  },
  components: {
    cardComponent: {
      imageOverlay: "rgba(0,0,0, 0.15)",
    },
    formComponent: {
      buttonMainBG: colorPalette.emerald[600],
      buttonRedBG: colorPalette.red[400],
      buttonSecondaryBG: colorPalette.neutral[600],
    },
    navBarListItem: {
      //Normal color is ui.colors.card
      hoveredBG: colorPalette.neutral[100],
      selectedBG: colorPalette.neutral[200],
    },
    notificationColors: {
      info: colorPalette.sky[600],
      bad: colorPalette.red[500],
      good: colorPalette.lime[600],
      message: colorPalette.neutral[600],
    },
    plainList: {
      hover: colorPalette.neutral[200],
      pressed: colorPalette.neutral[400],
    },
    toast: {
      backgroundColor: colorPalette.neutral[200],
    },
    groupedListInModal: {
      backgroundColor: colorPalette.neutral[100],
    },
  },
  textInput: {
    backgroundColor: colorPalette.neutral[200],
  },
  headerButtons: {
    color: Platform.OS === "ios" ? "rgb(0, 122, 255)" : "#000000",
  },

  margins: {
    sm: 2,
    md: 4,
    lg: 8,
    xl: 12,
  },
  marginsComponents: {
    section: 32,
    group: 8,
  },
} as const;

export const darkTheme = {
  ui: {
    dark: true,
    colors: {
      primary: "rgb(10, 132, 255)",
      background: "rgb(1, 1, 1)",
      card: "rgb(18,18,18)",
      text: "rgb(229, 229, 231)",
      border: "rgb(39, 39, 41)",
      notification: "rgb(255, 69, 58)",
    },
    fonts,
  },
  colors: {
    inverted: "#ffffff",
  },
  textPresets: {
    main: colorPalette.neutral[200],
    inverted: colorPalette.neutral[900],
    subtitle: colorPalette.neutral[500],
    link: colorPalette.sky[300],
  },
  components: {
    cardComponent: {
      imageOverlay: "rgba(0,0,0, 0.45)",
    },
    formComponent: {
      buttonMainBG: colorPalette.emerald[300],
      buttonRedBG: colorPalette.red[500],
      buttonSecondaryBG: colorPalette.neutral[300],
    },
    navBarListItem: {
      //Normal color is ui.colors.card
      hoveredBG: colorPalette.neutral[700],
      selectedBG: colorPalette.neutral[800],
    },
    notificationColors: {
      info: colorPalette.sky[300],
      bad: colorPalette.red[200],
      good: colorPalette.lime[300],
      message: colorPalette.neutral[300],
    },
    plainList: {
      hover: colorPalette.neutral[700],
      pressed: colorPalette.neutral[900],
    },
    toast: {
      backgroundColor: colorPalette.neutral[800],
    },
    groupedListInModal: {
      backgroundColor: colorPalette.neutral[900],
    },
  },
  textInput: {
    backgroundColor: colorPalette.neutral[800],
  },
  headerButtons: {
    color: Platform.OS === "ios" ? "rgb(10, 132, 255)" : "#ffffff",
  },
  margins: {
    sm: 2,
    md: 4,
    lg: 8,
    xl: 12,
  },
  marginsComponents: {
    section: 32,
    group: 8,
  },
} as const;
