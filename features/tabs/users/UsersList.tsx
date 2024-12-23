import EmptyScreen from "@/components/dataStates/EmptyScreen";
import ErrorScreen from "@/components/dataStates/ErrorScreen";
import { FetchingIndicator } from "@/components/dataStates/FetchingIndicator";
import UserThumbnail from "@/components/people/UserThumbnail";
import { SimpleList } from "@/components/simpleList/SimpleList";
import useUsers from "@/hooks/peopleHooks/useUsers";
import useProfile from "@/hooks/useProfile";
import React from "react";
import { FlatList, Text } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

export default function UsersList() {
  const { profile, isProfileLoading, fetchProfile } = useProfile();
  const { styles } = useStyles(stylesheet);
  const { users, usersAreLoading, fetchUsers } = useUsers();

  if (isProfileLoading || usersAreLoading) {
    return <FetchingIndicator caption={isProfileLoading ? "Cargando perfil" : "Cargando usuarios"} />;
  }

  if (!profile) {
    return (
      <ErrorScreen
        caption="Ocurrió un error al recuperar tu perfil."
        buttonCaption="Reintentar"
        retryFunction={fetchProfile}
      />
    );
  }

  if (!users) {
    return (
      <ErrorScreen
        caption="Ocurrió un error al recuperar los usuarios."
        buttonCaption="Reintentar"
        retryFunction={fetchUsers}
      />
    );
  }

  return (
    <FlatList
      refreshing={usersAreLoading}
      onRefresh={fetchUsers}
      contentInsetAdjustmentBehavior="automatic"
      data={users}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <SimpleList
          relativeToDirectory
          href={`./${item.id}`}
          leading={<UserThumbnail userId={item.id} size={60} />}
          content={
            <Text style={styles.listText}>{`${item.name} ${item.father_last_name} ${item.mother_last_name}`}</Text>
          }
        />
      )}
      ListEmptyComponent={<EmptyScreen caption="Ningún usuario por aquí." />}
    />
  );
}

const stylesheet = createStyleSheet((theme) => ({
  listText: {
    fontSize: 18,
    paddingLeft: 10,
    color: theme.textPresets.main,
    flexShrink: 1,
    marginRight: 18,
  },
}));
