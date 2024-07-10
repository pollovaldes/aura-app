import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack screenOptions={{ headerBackVisible: false }}>
      <Stack.Screen name="index" options={{ title: "Finalizar registro" }} />
    </Stack>
  );
}
