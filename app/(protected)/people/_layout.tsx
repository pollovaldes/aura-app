import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerLargeTitle: false,
      }}
    >
      <Stack.Screen name="index" options={{ title: "Personas" }} />
    </Stack>
  );
}
