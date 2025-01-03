import { SessionContextProvider } from "@/context/SessionContext";
import { supabase } from "@/lib/supabase";
import { Redirect, Slot } from "expo-router";
import { usePathname } from "expo-router/build/hooks";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import Toast from "react-native-toast-message";
import { toastConfig } from "@/components/toast/ToastConfig";
import { ThemeProvider } from "@react-navigation/native";
import { useStyles } from "react-native-unistyles";
import { useAccentColor } from "@/features/global/hooks/useAccentColor";

export default function RootLayout() {
  const path = usePathname();
  const { theme } = useStyles();
  useAccentColor();

  useEffect(() => {
    SplashScreen.setOptions({
      duration: 1000,
      fade: true,
    });
  }, []);

  return (
    <ThemeProvider value={theme.ui}>
      <SessionContextProvider supabaseClient={supabase}>
        {path === "/" && <Redirect href="/auth" />}
        <Slot />
        <Toast config={toastConfig} />
      </SessionContextProvider>
    </ThemeProvider>
  );
}
