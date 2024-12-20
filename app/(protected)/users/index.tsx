import EmptyScreen from "@/components/dataStates/EmptyScreen";
import ErrorScreen from "@/components/dataStates/ErrorScreen";
import { FetchingIndicator } from "@/components/dataStates/FetchingIndicator";
import UserThumbnail from "@/components/people/UserThumbnail";
import { SimpleList } from "@/components/simpleList/SimpleList";
import { useSearch } from "@/context/SearchContext";
import useUsers from "@/hooks/peopleHooks/useUsers";
import useProfile from "@/hooks/useProfile";
import React, { useEffect, useState } from "react";
import { FlatList, Text } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

export default function UsersList() {
  const { profile, isProfileLoading, fetchProfile } = useProfile();
  const { styles } = useStyles(stylesheet);
  const { searchState, setSearchQuery } = useSearch();
  const searchQuery = searchState["users"] || "";
  const { users, usersAreLoading, fetchUsers } = useUsers();
  const [filteredUsers, setFilteredUsers] = useState(users);

  const capitalizeWords = (text: string | null | undefined): string => {
    if (!text) return "";
    return text
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  useEffect(() => {
    if (searchQuery && users) {
      const filtered = users.filter((user) =>
        `${user.name} ${user.father_last_name} ${user.mother_last_name}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchQuery, users]);

  if (usersAreLoading || isProfileLoading) {
    return <FetchingIndicator caption={usersAreLoading ? "Cargando usuarios" : "Cargando perfil"} />;
  }

  if (!profile) {
    return (
      <ErrorScreen
        caption="Ocurrió un error al recuperar tu perfil"
        buttonCaption="Reintentar"
        retryFunction={fetchProfile}
      />
    );
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

  if (filteredUsers?.length === 0) {
    return <EmptyScreen caption="Ningún resultado" />;
  }

  return (
    <FlatList
      refreshing={usersAreLoading}
      onRefresh={fetchUsers}
      contentInsetAdjustmentBehavior="automatic"
      data={filteredUsers}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <SimpleList
          href={`/users/${item.id}`}
          leading={<UserThumbnail userId={item.id.toString()} size={60} />}
          content={
            <Text style={styles.listText}>
              {`${capitalizeWords(item.name)} ${capitalizeWords(item.father_last_name)} ${capitalizeWords(item.mother_last_name)}`}
            </Text>
          }
        />
      )}
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
