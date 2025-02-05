import { Stack } from "expo-router";
import { Platform } from "react-native";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerBlurEffect: "regular",
        headerTransparent: Platform.OS === "ios" ? true : false,
      }}
    />
  );
}
