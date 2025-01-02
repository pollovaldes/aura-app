import { SessionContextProvider } from "@/context/SessionContext";
import { supabase } from "@/lib/supabase";
import { Redirect, Slot } from "expo-router";
import { useColorScheme } from "react-native";
import { useNavigationContainerRef, usePathname } from "expo-router/build/hooks";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import Toast from "react-native-toast-message";
import { toastConfig } from "@/components/toast/ToastConfig";
import { useReactNavigationDevTools } from "@dev-plugins/react-navigation";
import { darkTheme, lightTheme } from "@/style/themes";
import { AccentThemeProvider } from "@/context/AccentThemeContext";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const path = usePathname();
  const currentTheme = colorScheme === "dark" ? darkTheme.ui : lightTheme.ui;

  const navigationRef = useNavigationContainerRef();
  useReactNavigationDevTools(navigationRef);

  useEffect(() => {
    SplashScreen.setOptions({
      duration: 1000,
      fade: true,
    });
  }, []);

  return (
    <AccentThemeProvider>
      <SessionContextProvider supabaseClient={supabase}>
        {path === "/" && <Redirect href="/auth" />}
        <Slot />
        <Toast config={toastConfig} />
      </SessionContextProvider>
    </AccentThemeProvider>
  );
}
