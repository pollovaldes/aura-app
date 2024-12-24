import ErrorScreen from "@/components/dataStates/ErrorScreen";
import { FetchingIndicator } from "@/components/dataStates/FetchingIndicator";
import { useSessionContext } from "@/context/SessionContext";
import useProfile from "@/hooks/useProfile";
import { supabase } from "@/lib/supabase";
import { Redirect, Tabs, usePathname } from "expo-router";
import { Bell, Boxes, CircleUserRound, Truck, UsersRound } from "lucide-react-native";
import React from "react";
import { Platform, useWindowDimensions } from "react-native";
import { createStyleSheet } from "react-native-unistyles";
import * as Haptics from "expo-haptics";

export default function HomeLayout() {
  const { width } = useWindowDimensions();
  const { profile, isProfileLoading } = useProfile();
  const { isLoading: isSessionLoading, session } = useSessionContext();
  const path = usePathname();

  const hapticFeedback = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  if (isSessionLoading || isProfileLoading) {
    return <FetchingIndicator caption={isSessionLoading ? "Cargando sesión" : "Cargando perfil"} />;
  }

  if (!session) {
    return <Redirect href="/auth" />;
  }

  if (!profile) {
    return (
      <ErrorScreen
        caption="No pudimos recuperar tu perfil. Intenta cerrar sesión y volver a iniciarla."
        buttonCaption="Cerrar sesión"
        retryFunction={() => supabase.auth.signOut({ scope: "local" })}
      />
    );
  }

  const requiresProfileCompletion = !profile.is_fully_registered && !path.includes("/profile");

  if (requiresProfileCompletion) {
    return <Redirect href="/tab/profile" />;
  }

  const isAdminOrOwner = profile.role === "ADMIN" || profile.role === "OWNER";
  const isBannedOrNoRole = profile.role === "BANNED" || profile.role === "NO_ROLE";

  const mayShowTab = {
    vehicles: isBannedOrNoRole ? null : profile.is_fully_registered ? undefined : null,
    users: isBannedOrNoRole ? null : isAdminOrOwner && profile.is_fully_registered ? undefined : null,
    fleets: isBannedOrNoRole ? null : profile.is_fully_registered ? undefined : null,
    notifications: isBannedOrNoRole ? null : profile.is_fully_registered ? undefined : null,
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarPosition: width >= 750 ? "left" : "bottom",
        tabBarVariant: width >= 750 ? "material" : "uikit",
        tabBarLabelPosition: "below-icon", // Always "below-icon"
      }}
    >
      <Tabs.Screen
        name="vehicles"
        options={{
          href: mayShowTab.vehicles,
          title: "Vehículos",
          tabBarIcon: ({ color }) => <Truck color={color} />,
        }}
        listeners={{
          tabPress: () => {
            hapticFeedback();
          },
        }}
      />
      <Tabs.Screen
        name="users"
        options={{
          href: mayShowTab.users,
          title: "Personas",
          tabBarIcon: ({ color }) => <UsersRound color={color} />,
        }}
        listeners={{
          tabPress: () => {
            hapticFeedback();
          },
        }}
      />
      <Tabs.Screen
        name="fleets"
        options={{
          href: mayShowTab.fleets,
          title: "Flotillas",
          tabBarIcon: ({ color }) => <Boxes color={color} />,
        }}
        listeners={{
          tabPress: () => {
            hapticFeedback();
          },
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          href: mayShowTab.notifications,
          title: "Notificaciones",
          tabBarIcon: ({ color }) => <Bell color={color} />,
        }}
        listeners={{
          tabPress: () => {
            hapticFeedback();
          },
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color }) => <CircleUserRound color={color} />,
        }}
        listeners={{
          tabPress: () => {
            hapticFeedback();
          },
        }}
      />
    </Tabs>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  fullscreenView: {
    flex: 1,
    backgroundColor: theme.ui.colors.card,
  },
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: theme.ui.colors.card,
  },
  innerContainer: {
    flexDirection: "row",
    width: "100%",
  },
  icon: {
    color: theme.colors.inverted,
  },
}));
