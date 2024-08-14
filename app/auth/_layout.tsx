import { Redirect, Stack } from "expo-router";
import "@/style/unistyles";
import { useSession, useSessionContext } from "@/context/SessionContext";
import LoadingScreen from "@/components/auth/LoadingScreen";

export const unstable_settings = {
  initialRouteName: "index",
};

export default function Layout() {
  const session = useSession();
  const { isLoading } = useSessionContext();

  //desomentar el siguiente bloque de código si se queda cargando, se borro tu usuario de supabase
  // return (
  //   <Stack>
  //     <Stack.Screen name="index" options={{ headerShown: false }} />
  //   </Stack>
  // );

  // console.log(isLoading, isAdminLoading, "isAdmin", isAdmin);

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
