import { useActiveRoute } from "@/features/routePage/hooks/useActiveRoute";
import { RouteHeader } from "@/features/routePage/RouteHeader";
import { Stack } from "expo-router";
import React from "react";

export default function Layout() {
  const { activeRoute, activeRouteIdIsLoading, activeRouteIsLoading } = useActiveRoute();

  const mayShowHeader = !activeRouteIdIsLoading && !activeRouteIsLoading && activeRoute;

  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: true,
          header: () => mayShowHeader && <RouteHeader />,
        }}
      />
      <Stack.Screen
        name="(modal)"
        options={{
          headerShown: false,
          presentation: "modal",
        }}
      />
    </Stack>
  );
}
