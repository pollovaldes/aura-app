import { Redirect, Slot, Tabs, usePathname } from "expo-router";
import { View, useWindowDimensions } from "react-native";
import Sidebar from "../../components/sidebar/Sidebar";
import ListItem from "../../components/sidebar/ListItem";
import { Bell, CircleUserRound, Truck, UsersRound } from "lucide-react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { useSessionContext } from "@/context/SessionContext";
import useProfile from "@/hooks/useProfile";
import { VehiclesContextProvider } from "@/context/VehiclesContext";
import LoadingScreen from "@/components/dataStates/LoadingScreen";
import ErrorScreen from "@/components/dataStates/ErrorScreen";
import { supabase } from "@/lib/supabase";
import { ProfileImageProvider } from "@/context/ProfileImageContext";
import { PeopleContextProvider } from "@/context/PeopleContext";

export default function HomeLayout() {
  const { styles } = useStyles(stylesheet);
  const { width } = useWindowDimensions();
  const widthThreshold = 600; // TODO: Move dimensions to a theme file.
  const { isLoading: isSessionLoading, error, session } = useSessionContext();
  const { isProfileLoading, profile } = useProfile();
  const path = usePathname();

  // Show loading screen while session or profile is loading
  if (isSessionLoading || isProfileLoading) {
    return (
      <View style={styles.fullscreenView}>
        <LoadingScreen caption="Cargando sesión" />
      </View>
    );
  }

  // Redirect to authentication if no session is present
  if (!session) {
    return <Redirect href="/auth" />;
  }

  // Show error screen if there's an issue with the session or profile
  if (error || !profile) {
    return (
      <View style={styles.fullscreenView}>
        <ErrorScreen
          caption="Ocurrió un error al recuperar tu sesión o tu perfil"
          buttonCaption="Intentar cerrar sesión"
          retryFunction={() => supabase.auth.signOut()}
        />
      </View>
    );
  }

  const requiresProfileCompletion =
    !profile.is_fully_registered && path !== "/profile";
  if (requiresProfileCompletion) {
    return <Redirect href="/profile" />;
  }

  // Determine tab visibility based on role and registration status
  const isAdminOrOwner = profile.role === "ADMIN" || profile.role === "OWNER";
  const isBannedOrNoRole =
    profile.role === "BANNED" || profile.role === "NO_ROLE";

  const mayShowTab = {
    vehicles: isBannedOrNoRole
      ? null
      : profile.is_fully_registered
        ? undefined
        : null,
    people: isBannedOrNoRole
      ? null
      : isAdminOrOwner && profile.is_fully_registered
        ? undefined
        : null,
    notifications: isBannedOrNoRole
      ? null
      : profile.is_fully_registered
        ? undefined
        : null,
  };

  const mayShowListItem = {
    vehicles: isBannedOrNoRole
      ? null
      : profile.is_fully_registered
        ? "vehicles"
        : null,
    people: isBannedOrNoRole
      ? null
      : isAdminOrOwner && profile.is_fully_registered
        ? "people"
        : null,
    notifications: isBannedOrNoRole
      ? null
      : profile.is_fully_registered
        ? "notifications"
        : null,
  };

  // Render UI based on the screen width (responsive design)
  return (
    <VehiclesContextProvider>
      <PeopleContextProvider>
          <ProfileImageProvider>
            {width > widthThreshold ? (
              <View style={styles.container}>
                <View style={styles.innerContainer}>
                  {/* Sidebar for larger screens */}
                  <Sidebar>
                    <ListItem
                      href={mayShowListItem.vehicles}
                      title="Vehículos"
                      iconComponent={
                        <Truck color={styles.icon.color} size={19} />
                      }
                    />
                    {isAdminOrOwner && (
                      <ListItem
                        href={mayShowListItem.people}
                        title="Personas"
                        iconComponent={
                          <UsersRound color={styles.icon.color} size={19} />
                        }
                      />
                    )}
                    <ListItem
                      href={mayShowListItem.notifications}
                      title="Notificaciones"
                      iconComponent={
                        <Bell color={styles.icon.color} size={19} />
                      }
                    />
                    <ListItem
                      href="profile"
                      title="Perfil"
                      iconComponent={
                        <CircleUserRound color={styles.icon.color} size={19} />
                      }
                    />
                  </Sidebar>
                  <Slot />
                </View>
              </View>
            ) : (
              // Tabs for smaller screens
              <Tabs screenOptions={{ headerShown: false }}>
                <Tabs.Screen
                  name="vehicles"
                  options={{
                    href: mayShowTab.vehicles,
                    title: "Vehículos",
                    tabBarIcon: ({ color }) => <Truck color={color} />,
                  }}
                />
                <Tabs.Screen
                  name="people"
                  options={{
                    href: mayShowTab.people,
                    title: "Personas",
                    tabBarIcon: ({ color }) => <UsersRound color={color} />,
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
                    tabBarIcon: ({ color }) => (
                      <CircleUserRound color={color} />
                    ),
                  }}
                />
              </Tabs>
            )}
          </ProfileImageProvider>
      </PeopleContextProvider>
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
    width: "85%",
  },
  icon: {
    color: theme.colors.inverted,
  },
}));
