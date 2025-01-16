import React, { useEffect } from "react";
import { Stack } from "expo-router";
import { useActiveRoute } from "@/features/routePage/hooks/useActiveRoute";
import ErrorScreen from "@/components/dataStates/ErrorScreen";
import { FetchingIndicator } from "@/components/dataStates/FetchingIndicator";
import { RouteHeader } from "@/features/routePage/RouteHeader";
import useProfile from "@/hooks/useProfile";

export default function Layout() {
  const { profile, isProfileLoading, fetchProfile } = useProfile();
  const { activeRoute, activeRouteIsLoading, error, fetchActiveRoute } = useActiveRoute();

  if (isProfileLoading || activeRouteIsLoading) {
    return <FetchingIndicator caption={isProfileLoading ? "Cargando perfil" : "Cargando rutas activas"} />;
  }

  if (!profile) {
    return (
      <ErrorScreen caption="No pudimos recuperar tu perfil." buttonCaption="Reintentar" retryFunction={fetchProfile} />
    );
  }

  if (error) {
    return (
      <ErrorScreen
        caption="No se pudieron cargar las rutas activas."
        buttonCaption="Reintentar"
        retryFunction={fetchActiveRoute}
      />
    );
  }

  const mayShowHeader = activeRoute && activeRoute.is_active && activeRoute.user_id === profile.id;

  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: mayShowHeader,
          header: () => <RouteHeader />,
        }}
      />
      <Stack.Screen
        name="(modal)"
        options={{
          headerShown: false,
          presentation: "modal",
        }}
      />
    </Stack>
  );
}
