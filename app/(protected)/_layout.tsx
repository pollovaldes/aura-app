import ErrorScreen from "@/components/dataStates/ErrorScreen";
import LoadingScreen from "@/components/dataStates/LoadingScreen";
import { ProfileImageProvider } from "@/context/ProfileImageContext";
import { useSessionContext } from "@/context/SessionContext";
import { UsersContextProvider } from "@/context/UsersContext";
import { VehiclesContextProvider } from "@/context/VehiclesContext";
import useProfile from "@/hooks/useProfile";
import { supabase } from "@/lib/supabase";
import { Redirect, Tabs, usePathname } from "expo-router";
import { Bell, Boxes, CircleUserRound, Truck, UsersRound } from "lucide-react-native";
import { Platform, View, useWindowDimensions } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

export default function HomeLayout() {
  const { styles } = useStyles(stylesheet);
  const { width } = useWindowDimensions();
  const { isLoading: isSessionLoading, error, session } = useSessionContext();
  const { isProfileLoading, profile } = useProfile();
  const path = usePathname();

  if (isSessionLoading || isProfileLoading) {
    return (
      <View style={styles.fullscreenView}>
        <LoadingScreen caption="Cargando sesión" />
      </View>
    );
  }

  if (!session) {
    return <Redirect href="/auth" />;
  }

  if (error || !profile) {
    return (
      <View style={styles.fullscreenView}>
        <ErrorScreen
          caption="Ocurrió un error al recuperar tu sesión o tu perfil"
          buttonCaption="Intentar cerrar sesión"
          retryFunction={() => supabase.auth.signOut({ scope: "local" })}
        />
      </View>
    );
  }

  const requiresProfileCompletion = !profile.is_fully_registered && !path.includes("/profile");

  if (requiresProfileCompletion) {
    return <Redirect href="/profile" />;
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
    <VehiclesContextProvider>
      <UsersContextProvider>
        <ProfileImageProvider>
          <Tabs
            screenOptions={{
              headerShown: false,
              tabBarPosition: width > 800 ? "left" : "bottom",
              tabBarVariant: Platform.OS === "web" && width > 800 ? "material" : "uikit",
              animation: Platform.OS === "web" ? "none" : "fade",
              tabBarLabelPosition: Platform.OS === "web" && width > 800 ? "below-icon" : "below-icon",
            }}
          >
            <Tabs.Screen
              name="vehicles"
              options={{
                href: mayShowTab.vehicles,
                title: "Vehículos",
                tabBarIcon: ({ color }) => <Truck color={color} />,
              }}
            />
            <Tabs.Screen
              name="users"
              options={{
                href: mayShowTab.users,
                title: "Personas",
                tabBarIcon: ({ color }) => <UsersRound color={color} />,
              }}
            />
            <Tabs.Screen
              name="fleets"
              options={{
                href: mayShowTab.fleets,
                title: "Flotillas",
                tabBarIcon: ({ color }) => <Boxes color={color} />,
              }}
            />
            <Tabs.Screen
              name="notifications"
              options={{
                href: mayShowTab.notifications,
                title: "Notificaciones",
                tabBarIcon: ({ color }) => <Bell color={color} />,
              }}
            />
            <Tabs.Screen
              name="profile"
              options={{
                title: "Perfil",
                tabBarIcon: ({ color }) => <CircleUserRound color={color} />,
              }}
            />
          </Tabs>
        </ProfileImageProvider>
      </UsersContextProvider>
    </VehiclesContextProvider>
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
