/*
 * index.tsx - Created on Mon Jun 24 2024 by Luis Arturo Valdes Romero
 *
 * Copyright (c) 2024 Aura Residuos Sustentables
 */

import { Redirect, Slot, Tabs } from "expo-router";
import { Text, View, useWindowDimensions } from "react-native";
import Sidebar from "../../../components/sidebar/Sidebar";
import ListItem from "../../../components/sidebar/ListItem";
import { Bell, CircleUserRound, Truck, UsersRound } from "lucide-react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { useSession, useSessionContext } from "@/context/SessionContext";
import LoadingScreen from "@/components/Auth/LoadingScreen";

export default function HomeLayout() {
  const { styles } = useStyles(stylesheet);
  const { width } = useWindowDimensions();
  const widthThreshold = 600; // TODO: Move dimensions to a theme file.

  const { isLoading, error } = useSessionContext();
  const session = useSession();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!session) {
    return <Redirect href="/auth" />;
  }

  if (error) {
    return <Text>Error</Text>;
  }

  //Show a web-like sidebar for occupying max space
  if (width >= widthThreshold) {
    // TODO: Add Sidebars
    return (
      <View style={styles.container}>
        <Sidebar>
          <ListItem
            href="trucks"
            title="Camiones"
            iconComponent={<Truck color={styles.icon.color} size={19} />}
          />
          <ListItem
            href="people"
            title="Personas"
            iconComponent={<UsersRound color={styles.icon.color} size={19} />}
          />
          <ListItem
            href="notifications"
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
    );
  }

  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="trucks"
        options={{
          title: "Camiones",
          tabBarIcon: ({ color }) => <Truck color={color} />,
        }}
      />
      <Tabs.Screen
        name="people"
        options={{
          title: "Personas",
          tabBarIcon: ({ color }) => <UsersRound color={color} />,
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
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
  );
}

const stylesheet = createStyleSheet((theme) => ({
  container: {
    flexDirection: "row",
    height: "100%",
  },
  icon: {
    color: theme.colors.inverted,
  },
}));
