import { RouteHeader } from "@/features/routePage/RouteHeader";
import { Stack } from "expo-router";
import React from "react";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: true,
          header: () => <RouteHeader />,
        }}
      />
      <Stack.Screen
        name="(modal)"
        options={{
          presentation: "transparentModal",
          animation: "fade",
          headerShown: false,
        }}
      />
    </Stack>
  );
}
