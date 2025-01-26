import { Text, FlatList } from "react-native";
import useUsers from "@/hooks/peopleHooks/useUsers";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import React from "react";
import useProfile from "@/hooks/useProfile";
import ErrorScreen from "../dataStates/ErrorScreen";
import UserThumbnail from "./UserThumbnail";
import { SimpleList } from "../simpleList/SimpleList";
import EmptyScreen from "../dataStates/EmptyScreen";
import { Stack } from "expo-router";
import { FetchingIndicator } from "../dataStates/FetchingIndicator";

export default function UsersList() {
  const { getGuaranteedProfile } = useProfile();
  const profile = getGuaranteedProfile();
  const { styles } = useStyles(stylesheet);
  const { users, usersAreLoading, fetchUsers } = useUsers();

  if (usersAreLoading) {
    return <FetchingIndicator caption={"Cargando usuarios"} />;
  }

  if (!users) {
    return (
      <ErrorScreen
        caption={`Ocurrió un error y no \npudimos cargar los usuarios`}
        buttonCaption="Reintentar"
        retryFunction={fetchUsers}
      />
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "Personas",
          headerLargeTitle: true,
        }}
      />
      <FlatList
        refreshing={usersAreLoading}
        onRefresh={fetchUsers}
        contentInsetAdjustmentBehavior="automatic"
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <SimpleList
            relativeToDirectory
            href={`./${item.id}`}
            leading={<UserThumbnail userId={item.id} size={60} />}
            content={
              <Text style={styles.Text}>{`${item.name} ${item.father_last_name} ${item.mother_last_name}`}</Text>
            }
          />
        )}
        ListEmptyComponent={<EmptyScreen caption="Ningún usuario por aquí." />}
      />
    </>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  Text: {
    fontSize: 18,
    color: theme.textPresets.main,
  },
  Subtitle: {
    fontSize: 15,
    color: theme.textPresets.subtitle,
  },
}));
