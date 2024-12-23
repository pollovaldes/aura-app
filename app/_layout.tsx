import { SessionContextProvider } from "@/context/SessionContext";
import { supabase } from "@/lib/supabase";
import { Redirect, Slot } from "expo-router";
import { useColorScheme } from "react-native";
import { useNavigationContainerRef, usePathname } from "expo-router/build/hooks";
import { ThemeProvider, DarkTheme, DefaultTheme } from "@react-navigation/native";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import Toast from "react-native-toast-message";
import { toastConfig } from "@/components/toast/ToastConfig";
import { useReactNavigationDevTools } from "@dev-plugins/react-navigation";
import { useLogger } from "@react-navigation/devtools";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const path = usePathname();
  const currentTheme = colorScheme === "dark" ? DarkTheme : DefaultTheme;

  const navigationRef = useNavigationContainerRef();
  useReactNavigationDevTools(navigationRef);
  //useLogger(navigationRef);

  useEffect(() => {
    SplashScreen.setOptions({
      duration: 1000,
      fade: true,
    });
  }, []);

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
