import { Redirect, Stack } from "expo-router";
import "@/style/unistyles";
import LoadingScreen from "@/components/Auth/LoadingScreen";
import useIsNameNull from "@/hooks/useIsNameNull";
import { useSession, useSessionContext } from "@/context/SessionContext";

export const unstable_settings = {
  initialRouteName: "index",
};

export default function Layout() {
  const { isLoading } = useSessionContext();
  const session = useSession();
  
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
