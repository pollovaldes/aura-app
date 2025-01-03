import { ProfileContextProvider } from "@/context/ProfileContext";
import { ProfileImageProvider } from "@/context/ProfileImageContext";
import { UsersContextProvider } from "@/context/UsersContext";
import { VehiclesContextProvider } from "@/context/VehiclesContext";
import { Stack } from "expo-router";
import React from "react";

const ACCENT_COLOR_STORAGE_KEY = "USER_SELECTED_ACCENT_COLOR";

export default function Layout() {
  return (
    <ProfileContextProvider>
      <VehiclesContextProvider>
        <UsersContextProvider>
          <ProfileImageProvider>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen
                name="(modal)"
                options={{
                  headerShown: false,
                  presentation: "modal",
                }}
              />
            </Stack>
          </ProfileImageProvider>
        </UsersContextProvider>
      </VehiclesContextProvider>
    </ProfileContextProvider>
  );
}
