/*
 * _layout.tsx - Created on Sat Jun 29 2024 by Luis Arturo Valdes Romero
 *
 * Copyright (c) 2024 Aura Residuos Sustentables
 */

import { Redirect, Stack } from "expo-router";
import "@/style/unistyles";
import { useSession, useSessionContext } from "@/context/SessionContext";
import LoadingScreen from "@/components/Auth/LoadingScreen";

export const unstable_settings = {
  initialRouteName: "index",
};

export default function Layout() {
  const { isLoading } = useSessionContext();
  const session = useSession();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (session) {
    return <Redirect href="/trucks" />;
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
