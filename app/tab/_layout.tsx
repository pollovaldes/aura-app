import { ProfileImageProvider } from "@/context/ProfileImageContext";
import { UsersContextProvider } from "@/context/UsersContext";
import { VehiclesContextProvider } from "@/context/VehiclesContext";
import { Stack } from "expo-router";

export default function Layout() {
  return (
    <VehiclesContextProvider>
      <UsersContextProvider>
        <ProfileImageProvider>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(details)" options={{ presentation: "modal", headerShown: false }} />
          </Stack>
        </ProfileImageProvider>
      </UsersContextProvider>
    </VehiclesContextProvider>
  );
}
