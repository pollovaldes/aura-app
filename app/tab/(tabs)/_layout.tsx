import { FetchingIndicator } from "@/components/dataStates/FetchingIndicator";
import { useSessionContext } from "@/context/SessionContext";
import useProfile from "@/hooks/useProfile";
import { Redirect, Tabs, usePathname } from "expo-router";
import { Bell, Boxes, CircleUserRound, PanelLeft, PanelRight, Truck, UsersRound } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { Platform, useWindowDimensions } from "react-native";
import { createStyleSheet } from "react-native-unistyles";
import * as Haptics from "expo-haptics";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HomeLayout() {
  const { width } = useWindowDimensions();
  const { getGuaranteedProfile } = useProfile();
  const profile = getGuaranteedProfile();
  const { isLoading: isSessionLoading, session } = useSessionContext();
  const path = usePathname();
  const [tabBarPosition, setTabBarPosition] = useState<"left" | "right">("left");

  const TAB_BAR_POSITION_KEY = "TAB_BAR_POSITION";

  useEffect(() => {
    const loadTabBarPosition = async () => {
      try {
        const storedPosition = await AsyncStorage.getItem(TAB_BAR_POSITION_KEY);
        if (storedPosition === "left" || storedPosition === "right") {
          setTabBarPosition(storedPosition);
        }
      } catch (error) {
        console.error("Error al cargar la posición de la barra de pestañas: ", error);
      }
    };

    loadTabBarPosition();
  }, []);

  useEffect(() => {
    const saveTabBarPosition = async () => {
      try {
        await AsyncStorage.setItem(TAB_BAR_POSITION_KEY, tabBarPosition);
      } catch (error) {
        console.error("Error al guardar la posición de la barra de pestañas:", error);
      }
    };

    saveTabBarPosition();
  }, [tabBarPosition]);

  const hapticFeedback = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  if (isSessionLoading) {
    return <FetchingIndicator caption={"Cargando sesión"} />;
  }

  if (!session) {
    return <Redirect href="/auth" />;
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
        tabBarPosition: width >= 750 ? tabBarPosition : "bottom",
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
      <Tabs.Screen
        name="dummy/index"
        options={{
          title: "Posición",
          href: width <= 750 ? null : undefined,
          tabBarIcon: ({ color }) =>
            tabBarPosition === "left" ? <PanelRight color={color} /> : <PanelLeft color={color} />,
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            hapticFeedback();
            setTabBarPosition((prevPosition) => (prevPosition === "left" ? "right" : "left"));
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
