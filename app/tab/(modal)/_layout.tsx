import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="vehicle_details/[vehicleId]/index" />
      <Stack.Screen name="user_details/[userId]/index" />
      <Stack.Screen name="route_wizard/index" />
    </Stack>
  );
}
