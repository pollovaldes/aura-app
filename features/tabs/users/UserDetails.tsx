import React from "react";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { View, ScrollView, RefreshControl } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import GroupedList from "@/components/grouped-list/GroupedList";
import Row from "@/components/grouped-list/Row";
import { Info, SquarePen, Trash, Truck } from "lucide-react-native";
import { colorPalette } from "@/style/themes";
import ProfileColumn from "@/components/people/ProfileColumn";
import ErrorScreen from "@/components/dataStates/ErrorScreen";
import useUsers from "@/hooks/peopleHooks/useUsers";
import UnauthorizedScreen from "@/components/dataStates/UnauthorizedScreen";
import useProfile from "@/hooks/useProfile";
import { FetchingIndicator } from "@/components/dataStates/FetchingIndicator";

export function UserDetails() {
  const { styles } = useStyles(stylesheet);
  const { users, usersAreLoading, fetchUsers } = useUsers();
  const { getGuaranteedProfile } = useProfile();
  const profile = getGuaranteedProfile();
  const { userId } = useLocalSearchParams<{ userId: string }>();

  if (usersAreLoading) {
    return <FetchingIndicator caption={"Cargando usuarios"} />;
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
      <UnauthorizedScreen
        caption="No tienes acceso a este recurso."
        buttonCaption="Reintentar"
        retryFunction={fetchUsers}
      />
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
        refreshControl={<RefreshControl refreshing={usersAreLoading} onRefresh={fetchUsers} />}
      >
        <View style={styles.container}>
          <GroupedList>
            <Row>
              <ProfileColumn profile={user} showPosition />
            </Row>
          </GroupedList>
          <GroupedList>
            <Row
              title="Información personal"
              icon={Info}
              backgroundColor={colorPalette.cyan[500]}
              onPress={() => router.push("./personal_data", { relativeToDirectory: true })}
            />
            <Row title="Editar rol" icon={SquarePen} backgroundColor={colorPalette.green[500]} />
          </GroupedList>
          <GroupedList header="Acciones">
            <Row
              title="Eliminar usuario"
              icon={Trash}
              backgroundColor={colorPalette.red[500]}
              show={profile.role === "OWNER" || profile.is_super_admin}
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
