import ErrorScreen from "@/components/dataStates/ErrorScreen";
import { FetchingIndicator } from "@/components/dataStates/FetchingIndicator";
import useProfile from "@/hooks/useProfile";
import { Stack } from "expo-router";

export default function Layout() {
  const { profile, isProfileLoading, fetchProfile } = useProfile();

  if (isProfileLoading) {
    return <FetchingIndicator caption="Cargando perfil" />;
  }

  if (!profile) {
    return (
      <ErrorScreen
        caption="Ocurrió un error y no pudimos recuperar tu perfil"
        buttonCaption="Reintentar"
        retryFunction={fetchProfile}
      />
    );
  }

  return <Stack screenOptions={{ title: "Network Watchdog", headerShown: false }} />;
}
