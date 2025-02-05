import React, { useEffect } from "react";
import { Stack, usePathname } from "expo-router";
import { useActiveRoute } from "@/features/routePage/hooks/useActiveRoute";
import ErrorScreen from "@/components/dataStates/ErrorScreen";
import { FetchingIndicator } from "@/components/dataStates/FetchingIndicator";
import { RouteHeader } from "@/features/routePage/RouteHeader";
import useProfile from "@/hooks/useProfile";
import { useStyles } from "react-native-unistyles";
import { UnistylesRuntime } from "react-native-unistyles";
import { pickTextColor } from "@/features/global/functions/pickTectColor";
import { Platform, Text, View } from "react-native";
import { setStatusBarStyle } from "expo-status-bar";
import { OfflineOverlay } from "@/features/global/components/OfflineOverlay";

export default function Layout() {
  const { profile, isProfileLoading, fetchProfile } = useProfile();
  const { activeRoute, activeRouteIsLoading, error, fetchActiveRoute } = useActiveRoute(profile?.id);
  const { theme } = useStyles();
  const headerTextColor = pickTextColor(theme.ui.colors.primary);
  const path = usePathname();
  const isInModalPath =
    path.includes("/tab/route_details") || path.includes("/tab/user_details") || path.includes("/tab/vehicles_details");
  const mayShowHeader = !!(activeRoute && activeRoute.is_active && activeRoute.user_id === profile!.id);

  useEffect(() => {
    if (mayShowHeader) {
      setStatusBarStyle(
        mayShowHeader && !isInModalPath
          ? headerTextColor === "#000000"
            ? "dark"
            : "light"
          : UnistylesRuntime.colorScheme === "dark"
            ? "light"
            : "dark"
      );
    }
  }, [mayShowHeader, isInModalPath, headerTextColor, UnistylesRuntime.colorScheme]);

  if (isProfileLoading) {
    return <FetchingIndicator caption={isProfileLoading ? "Cargando perfil" : "Cargando rutas activas"} />;
  }

  if (!profile) {
    return (
      <ErrorScreen caption="No pudimos recuperar tu perfil." buttonCaption="Reintentar" retryFunction={fetchProfile} />
    );
  }

  // if (error) {
  //   return (
  //     <ErrorScreen
  //       caption="No se pudieron cargar las rutas activas."
  //       buttonCaption="Reintentar"
  //       retryFunction={fetchActiveRoute}
  //     />
  //   );
  // }

  return (
    <>
      <Stack
        screenOptions={
          Platform.OS === "android"
            ? {
                statusBarBackgroundColor:
                  mayShowHeader && !isInModalPath ? theme.ui.colors.primary : theme.ui.colors.card,
                statusBarStyle:
                  mayShowHeader && !isInModalPath
                    ? headerTextColor === "#000000"
                      ? "dark"
                      : "light"
                    : UnistylesRuntime.colorScheme === "dark"
                      ? "light"
                      : "dark",
              }
            : undefined
        }
      >
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
    </>
  );
}
