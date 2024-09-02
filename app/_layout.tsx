import { SessionContextProvider } from "@/context/SessionContext";
import { supabase } from "@/lib/supabase";
import { Redirect, Slot } from "expo-router";
import { ThemeProvider } from "@react-navigation/native";
import { useColorScheme } from "react-native";
import { darkTheme, lightTheme } from "@/style/themes";
import { usePathname } from "expo-router/build/hooks";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const path = usePathname();

  return (
    <SessionContextProvider supabaseClient={supabase}>
      <ThemeProvider
          value={colorScheme === "dark" ? darkTheme.ui : lightTheme.ui}
        >
          {path === "/" && <Redirect href="/auth" />}
          <Slot />
      </ThemeProvider>
    </SessionContextProvider>
  );
}
