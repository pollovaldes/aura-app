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
import { ProfileContextProvider } from "@/context/ProfileContext";
import { VehiclesContextProvider } from "@/context/VehiclesContext";
import { UsersContextProvider } from "@/context/UsersContext";
import { ProfileImageProvider } from "@/context/ProfileImageContext";
import { RoutesContextProvider } from "@/features/routePage/context/RoutesContext";
import { useFonts } from "expo-font";
import { UnistylesRuntime } from "react-native-unistyles";
import { setStatusBarStyle } from "expo-status-bar";
import { FleetsContextProvider } from "@/context/FleetsContext";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/RobotoMono-SemiBold.ttf"),
  });

  useEffect(() => {
    SplashScreen.setOptions({
      duration: 1000,
      fade: true,
    });
  }, []);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    if (UnistylesRuntime.colorScheme === "dark") {
      setStatusBarStyle("auto");
    } else {
      setStatusBarStyle("auto");
    }
  }, [UnistylesRuntime.colorScheme]);

  const path = usePathname();
  const { theme } = useStyles();
  useAccentColor();

  return (
    <ThemeProvider value={theme.ui}>
      <SessionContextProvider supabaseClient={supabase}>
        <ProfileContextProvider>
          <VehiclesContextProvider>
            <UsersContextProvider>
              <FleetsContextProvider>
                <ProfileImageProvider>
                  <RoutesContextProvider>
                    {path === "/" && <Redirect href="/auth" />}
                    <Slot />
                    <Toast config={toastConfig} />
                  </RoutesContextProvider>
                </ProfileImageProvider>
              </FleetsContextProvider>
            </UsersContextProvider>
          </VehiclesContextProvider>
        </ProfileContextProvider>
      </SessionContextProvider>
    </ThemeProvider>
  );
}
