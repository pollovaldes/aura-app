import { Text, FlatList } from "react-native";
import useUsers from "@/hooks/peopleHooks/useUsers";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react-native";
import { useSearch } from "@/context/SearchContext";
import React from "react";
import useProfile from "@/hooks/useProfile";
import { FetchingIndicator } from "@/components/dataStates/FetchingIndicator";
import ErrorScreen from "@/components/dataStates/ErrorScreen";
import EmptyScreen from "@/components/dataStates/EmptyScreen";
import UserThumbnail from "@/components/people/UserThumbnail";
import { SimpleList } from "@/components/simpleList/SimpleList";

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
            <Text style={styles.itemText}>
              {`${capitalizeWords(item.name)} ${capitalizeWords(item.father_last_name)} ${capitalizeWords(item.mother_last_name)}`}
            </Text>
          }
          trailing={<ChevronRight color={styles.chevron.color} />}
        />
      )}
    />
  );
}

const stylesheet = createStyleSheet((theme) => ({
  container: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: theme.ui.colors.border,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  imageContainer: {
    padding: 12,
  },
  image: {
    borderRadius: 6,
    width: 50,
    height: 50,
  },
  itemText: {
    fontSize: 18,
    paddingLeft: 10,
    color: theme.textPresets.main,
    flexShrink: 1,
    marginRight: 18,
  },
  plusIcon: {
    fontSize: 16,
    color: theme.headerButtons.color,
  },
  chevron: {
    color: theme.textPresets.subtitle,
  },
  chevronView: {
    paddingRight: 12,
  },
}));
