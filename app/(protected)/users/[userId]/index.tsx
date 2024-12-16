import React from "react";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { View, ScrollView, RefreshControl } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import GroupedList from "@/components/grouped-list/GroupedList";
import Row from "@/components/grouped-list/Row";
import { Info, SquarePen, Truck } from "lucide-react-native";
import { colorPalette } from "@/style/themes";
import ProfileColumn from "@/components/people/ProfileColumn";
import ErrorScreen from "@/components/dataStates/ErrorScreen";
import useUsers from "@/hooks/peopleHooks/useUsers";
import UnauthorizedScreen from "@/components/dataStates/UnauthorizedScreen";
import useProfile from "@/hooks/useProfile";
import { FetchingIndicator } from "@/components/dataStates/FetchingIndicator";

export default function Index() {
  const { styles } = useStyles(stylesheet);
  const { users, usersAreLoading, fetchUsers } = useUsers();
  const { profile, isProfileLoading, fetchProfile } = useProfile();
  const { userId } = useLocalSearchParams<{ userId: string }>();

  if (isProfileLoading || usersAreLoading) {
    return (
      <FetchingIndicator
        caption={isProfileLoading ? "Cargando perfil" : "Cargando usuarios"}
      />
    );
  }

  if (!profile) {
    return (
      <>
        <Stack.Screen
          options={{
            title: "Error",
            headerLargeTitle: false,
            headerRight: undefined,
          }}
        />
        <ErrorScreen
          caption="Ocurrió un error al recuperar tu perfil"
          buttonCaption="Reintentar"
          retryFunction={fetchProfile}
        />
      </>
    );
  }

  if (!users) {
    return (
      <ErrorScreen
        caption="Ocurrió un error al recuperar tu perfil"
        buttonCaption="Reintentar"
        retryFunction={fetchUsers}
      />
    );
  }

  const user = users.find((user) => user.id === userId);

  if (!user) {
    return (
      <>
        <Stack.Screen options={{ title: "Recurso inaccesible" }} />
        <UnauthorizedScreen
          caption="No tienes acceso a este recurso."
          buttonCaption="Reintentar"
          retryFunction={fetchUsers}
        />
      </>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: user.id === profile.id ? "Tú" : "",
          headerLargeTitle: false,
        }}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        refreshControl={
          <RefreshControl
            refreshing={isProfileLoading || usersAreLoading}
            onRefresh={() => {
              fetchProfile();
              fetchUsers();
            }}
          />
        }
      >
        <View style={styles.container}>
          <GroupedList>
            <Row trailingType="chevron" title="" showChevron={false}>
              <ProfileColumn profile={user} showPosition />
            </Row>
          </GroupedList>
          <GroupedList>
            <Row
              title="Información personal"
              trailingType="chevron"
              icon={<Info size={24} color="white" />}
              color={colorPalette.cyan[500]}
            />
          </GroupedList>
          <GroupedList header="Acciones">
            <Row
              title="Editar rol"
              trailingType="chevron"
              icon={<SquarePen size={24} color="white" />}
              color={colorPalette.red[500]}
            />
            <Row
              title="Asignación de vehículos"
              trailingType="chevron"
              icon={<Truck size={24} color="white" />}
              color={colorPalette.green[500]}
            />
          </GroupedList>
        </View>
      </ScrollView>
    </>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  container: {
    gap: theme.marginsComponents.section,
    marginTop: theme.marginsComponents.section,
  },
  imageContainer: {
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  image: {
    width: "100%",
    height: 250,
  },
  permissionsDescription: {
    color: theme.textPresets.main,
    fontSize: 16,
  },
}));
