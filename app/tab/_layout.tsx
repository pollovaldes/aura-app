import { ActionButton } from "@/components/actionButton/ActionButton";
import { ActionButtonGroup } from "@/components/actionButton/ActionButtonGroup";
import { ProfileImageProvider } from "@/context/ProfileImageContext";
import { UsersContextProvider } from "@/context/UsersContext";
import { VehiclesContextProvider } from "@/context/VehiclesContext";
import { router, Stack } from "expo-router";
import React from "react";

export default function Layout() {
  return (
    <VehiclesContextProvider>
      <UsersContextProvider>
        <ProfileImageProvider>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="(details)"
              options={{
                presentation: "modal",
                gestureEnabled: false,
                headerShown: false,
              }}
            />
          </Stack>
        </ProfileImageProvider>
      </UsersContextProvider>
    </VehiclesContextProvider>
  );
}
