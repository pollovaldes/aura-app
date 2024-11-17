import { SessionContextProvider } from "@/context/SessionContext";
import { supabase } from "@/lib/supabase";
import { Redirect, Slot } from "expo-router";
import { useColorScheme } from "react-native";
import { usePathname } from "expo-router/build/hooks";
import {
  ThemeProvider,
  DarkTheme,
  DefaultTheme,
} from "@react-navigation/native";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const path = usePathname();

  const currentTheme = colorScheme === "dark" ? DarkTheme : DefaultTheme;

  return (
    <ThemeProvider value={currentTheme}>
      <SessionContextProvider supabaseClient={supabase}>
        {path === "/" && <Redirect href="/auth" />}
        <Slot />
      </SessionContextProvider>
    </ThemeProvider>
  );
}
