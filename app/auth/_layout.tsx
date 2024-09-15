import { Redirect, Stack } from "expo-router";
import "@/style/unistyles";
import { useSessionContext } from "@/context/SessionContext";
import LoadingScreen from "@/components/Auth/LoadingScreen";

export const unstable_settings = {
  initialRouteName: "index",
};

export default function Layout() {
  const { isLoading, session } = useSessionContext();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (session) {
    return <Redirect href="/trucks" />;
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
