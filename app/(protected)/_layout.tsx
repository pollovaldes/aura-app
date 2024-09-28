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
          retryFunction={() => supabase.auth.signOut()}
        />
      </View>
    );
  }

  if (!profile.is_fully_registered && path !== "/profile") {
    return <Redirect href="/profile" />;
  }

  return (
    <VehiclesContextProvider>
      <PeopleContextProvider>
        <ProfileImageProvider>
          {width > widthThreshold ? (
            <View style={styles.container}>
              <Sidebar>
                <ListItem
                  href={profile.is_fully_registered ? "vehicles" : null}
                  title="Camiones"
                  iconComponent={<Truck color={styles.icon.color} size={19} />}
                />
                {profile.role === "ADMIN" && (
                  <ListItem
                    href={
                      profile.role === "ADMIN" || profile.is_fully_registered
                        ? "people"
                        : null
                    }
                    title="Personas"
                    iconComponent={
                      <UsersRound color={styles.icon.color} size={19} />
                    }
                  />
                )}
                <ListItem
                  href={profile.is_fully_registered ? "notifications" : null}
                  title="Notificaciones"
                  iconComponent={<Bell color={styles.icon.color} size={19} />}
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
          ) : (
            <Tabs screenOptions={{ headerShown: false }}>
              <Tabs.Screen
                name="vehicles"
                options={{
                  href: !profile.is_fully_registered ? null : undefined,
                  title: "Camiones",
                  tabBarIcon: ({ color }) => <Truck color={color} />,
                }}
              />
              <Tabs.Screen
                name="people"
                options={{
                  href:
                    profile.role !== "ADMIN" || !profile.is_fully_registered
                      ? null
                      : undefined,
                  title: "Personas",
                  tabBarIcon: ({ color }) => <UsersRound color={color} />,
                }}
              />
              <Tabs.Screen
                name="notifications"
                options={{
                  href: !profile.is_fully_registered ? null : undefined,
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
    flexDirection: "row",
    height: "100%",
  },
  icon: {
    color: theme.colors.inverted,
  },
}));
