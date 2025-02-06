import { Stack } from "expo-router";
import { Platform } from "react-native";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerBlurEffect: "regular",
        title: "Escanear QR",
        headerTransparent: Platform.OS === "ios" ? true : false,
      }}
    />
  );
}
