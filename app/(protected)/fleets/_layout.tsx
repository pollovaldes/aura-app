import { Stack } from "expo-router";
import { Platform } from "react-native";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerLargeTitle: true,
        headerBlurEffect: "regular",
        headerTransparent: Platform.OS === "ios" ? true : false,
      }}
    >
      <Stack.Screen name="index" options={{ title: "Flotillas" }} />
      <Stack.Screen name="index/[fleetId]" />
    </Stack>
  );
}
