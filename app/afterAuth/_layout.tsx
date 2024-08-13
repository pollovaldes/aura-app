import { Redirect, Stack } from "expo-router";
import "@/style/unistyles";
import LoadingScreen from "@/components/Auth/LoadingScreen";
import useIsNameNull from "@/hooks/useIsNameNull";
import useIsAdmin from "@/hooks/useIsAdmin";

export const unstable_settings = {
  initialRouteName: "index",
};

export default function Layout() {
  const { isNameNull, isProfileLoading, error} = useIsNameNull();
  const { isAdmin, isAdminLoading } = useIsAdmin();
  
  if (isProfileLoading || isAdminLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <Redirect href="/auth/login" />;
  }

  console.log(isNameNull, isAdmin);

  if (isNameNull) {
    return (
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
    );
  }

  if (!isNameNull && isAdmin === "admin") {
    return <Redirect href="/admin/trucks" />;
  }

  if (!isNameNull && isAdmin === "user") {
    return <Redirect href="/user/trucks" />;
  }
}
