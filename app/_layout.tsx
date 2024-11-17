import { SessionContextProvider } from "@/context/SessionContext";
import { supabase } from "@/lib/supabase";
import { Redirect, Slot } from "expo-router";
import {
  DarkTheme,
  ThemeProvider,
  DefaultTheme,
} from "@react-navigation/native";
import { useColorScheme } from "react-native";
import { usePathname } from "expo-router/build/hooks";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const path = usePathname();

  const currentTheme = colorScheme === "dark" ? DarkTheme : DefaultTheme;

  return (
    <SessionContextProvider supabaseClient={supabase}>
      <ThemeProvider value={currentTheme}>
        {path === "/" && <Redirect href="/auth" />}
        <Slot />
      </ThemeProvider>
    </SessionContextProvider>
  );
}
