import { Redirect, Stack } from "expo-router";
import "@/style/unistyles";
import LoadingScreen from "@/components/Auth/LoadingScreen";
import useIsNameNull from "@/hooks/useIsNameNull";
import useIsAdmin from "@/hooks/useIsAdmin";

export default function Layout() {
  const { isNameNull, isProfileLoading, error } = useIsNameNull();
  const { isAdmin, isAdminLoading } = useIsAdmin();

  if (isProfileLoading || isAdminLoading) {
    return <LoadingScreen />;
  }

  if (isNameNull) {
    return (
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
    );
  }

  if (!isNameNull) {
    if (isAdmin === "admin") {
      return <Redirect href="/trucks" />;
    }
  }

  if (error) {
    return <Redirect href="/auth/index" />;
  }
}
