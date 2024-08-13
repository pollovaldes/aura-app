/*
 * _layout.tsx - Created on Sat Jun 29 2024 by Luis Arturo Valdes Romero
 *
 * Copyright (c) 2024 Aura Residuos Sustentables
 */

import { Redirect, Stack } from "expo-router";
import "@/style/unistyles";
import { useSession, useSessionContext } from "@/context/SessionContext";
import LoadingScreen from "@/components/Auth/LoadingScreen";
import useIsAdmin from "@/hooks/useIsAdmin";
import { Text, View } from "react-native";

export const unstable_settings = {
  initialRouteName: "index",
};

export default function Layout() {
  const session = useSession();
  const { isLoading } = useSessionContext();

// desomentar el siguiente bloque de código si se queda cargando, se borro tu usuario de supabase
/*
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
*/
  
// console.log(isLoading, isAdminLoading, "isAdmin", isAdmin);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if ( !session ) {
    return (
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
    );
  }
  
  if ( session ) {
    return <Redirect href="/afterAuth"/>;
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
