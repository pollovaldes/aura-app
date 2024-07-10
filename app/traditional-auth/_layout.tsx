import { Stack, useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function Layout() {
  const local = useLocalSearchParams();

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          headerLargeTitle: false,
          title:
            local.provider === "email"
              ? "Correo electrónico"
              : "Número telefónico",
          headerTransparent: false,
        }}
      />
    </Stack>
  );
}
