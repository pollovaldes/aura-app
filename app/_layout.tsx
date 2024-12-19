import { SessionContextProvider } from "@/context/SessionContext";
import { supabase } from "@/lib/supabase";
import { Redirect, Slot } from "expo-router";
import { Text, useColorScheme, View } from "react-native";
import { usePathname } from "expo-router/build/hooks";
import { ThemeProvider, DarkTheme, DefaultTheme } from "@react-navigation/native";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import Toast, { BaseToastProps } from "react-native-toast-message";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { createStyleSheet, useStyles } from "react-native-unistyles";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const path = usePathname();
  const currentTheme = colorScheme === "dark" ? DarkTheme : DefaultTheme;
  const insets = useSafeAreaInsets();
  const { styles } = useStyles(stylesheet);

  useEffect(() => {
    SplashScreen.setOptions({
      duration: 1000,
      fade: true,
    });
  }, []);

  const toastConfig = {
    alert: ({
      text1,
      text2,
      customComponent,
    }: {
      text1?: string;
      text2?: string;
      customComponent?: React.ReactNode;
    }) => {
      return (
        <View style={[styles.toastContainer, { marginTop: insets.top / 2 }]}>
          {text1 && (
            <Text style={styles.title} selectable={false}>
              {text1}
            </Text>
          )}
          {text2 && (
            <Text style={styles.caption} selectable={false}>
              {text2}
            </Text>
          )}
          {customComponent && customComponent}
        </View>
      );
    },
  };

  return (
    <ThemeProvider value={currentTheme}>
      <SessionContextProvider supabaseClient={supabase}>
        {path === "/" && <Redirect href="/auth" />}
        <Slot />
        <Toast config={toastConfig} />
      </SessionContextProvider>
    </ThemeProvider>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  toastContainer: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    backgroundColor: theme.components.toast.backgroundColor,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.textPresets.main,
  },
  caption: {
    fontSize: 15,
    color: theme.textPresets.subtitle,
  },
}));
