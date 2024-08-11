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
  const { isLoading } = useSessionContext();
  const { isAdmin, isAdminLoading } = useIsAdmin();
  const session = useSession();

  
  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isAdminLoading) {
    return <LoadingScreen />;
  }
  
  if ( session && isAdmin === "admin" ) {
    return <Redirect href="/admin/trucks" />;
  }

  if ( session && !isAdmin ) {
    return <Redirect href="/user/trucks" />;
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
