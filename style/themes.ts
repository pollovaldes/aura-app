// export const lightTheme = {
//   colors: {
//     text: {
//       main: "#1c1c1e",
//       mainInverted: "#e5e5e7",
//       subtitle: "#8a8a8e",
//     },
//     brands: {
//       inverted: "#000000",
//       phone: "#3478f6",
//     },
//     backgroundMain: "#ffffff",
//     backgroundSecondary: "#fafafa",
//     backgroundTertiary: "#f5f5f7",
//     backgroundSelected: "#e7e7e9",
//     outline: "#d8d8d8",
//     inverted: "#000000",
//     primary: "#3478f6",
//     imageOverlay: "rgba(0,0,0, 0.15)",
//   },
//   margins: {
//     sm: 2,
//     md: 4,
//     lg: 8,
//     xl: 12,
//   },
// } as const;

// export const darkTheme = {
//   colors: {
//     text: {
//       main: "#e5e5e7",
//       mainInverted: "#1c1c1e",
//       subtitle: "#98989e",
//     },
//     brands: {
//       inverted: "#ffffff",
//       phone: "#7ab6ff",
//     },
//     backgroundMain: "#000000",
//     backgroundSecondary: "#0d0d0d",
//     backgroundTertiary: "#141414",
//     backgroundSelected: "#181816",
//     outline: "#272729",
//     inverted: "#ffffff",
//     primary: "#3b82f7",
//     imageOverlay: "rgba(0,0,0, 0.45)",
//   },
//   margins: {
//     sm: 2,
//     md: 4,
//     lg: 8,
//     xl: 12,
//   },
// } as const;

const colorPalette = {
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
      buttonNeutralBG: colorPalette.neutral[600],
      buttonSkyBG: colorPalette.sky[600],
    },
  },
  textInput: {
    backgroundColor: colorPalette.neutral[100],
  },
  margins: {
    sm: 2,
    md: 4,
    lg: 8,
    xl: 12,
  },
} as const;

export const darkTheme = {
  ui: {
    dark: true,
    colors: {
      primary: "rgb(10, 132, 255)",
      background: "rgb(1, 1, 1)",
      card: "rgb(18, 18, 18)",
      text: "rgb(229, 229, 231)",
      border: "rgb(39, 39, 41)",
      notification: "rgb(255, 69, 58)",
    },
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
      buttonNeutralBG: colorPalette.neutral[300],
      buttonSkyBG: colorPalette.sky[300],
    },
  },
  textInput: {
    backgroundColor: colorPalette.neutral[800],
  },
  margins: {
    sm: 2,
    md: 4,
    lg: 8,
    xl: 12,
  },
} as const;
