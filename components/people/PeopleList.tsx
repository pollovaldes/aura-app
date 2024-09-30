import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  Pressable,
  Image,
} from "react-native";
import usePeople from "@/hooks/peopleHooks/usePeople";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { Link, Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react-native";
import { useSearch } from "@/context/SearchContext";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import React from "react";
import useProfile from "@/hooks/useProfile";
import LoadingScreen from "../dataStates/LoadingScreen";
import ErrorScreen from "../dataStates/ErrorScreen";
import PictureUpload from "../profile/PictureUpload";
import EmptyScreen from "../dataStates/EmptyScreen";

export default function PeopleList() {
  const { profile, isProfileLoading, fetchProfile } = useProfile();
  const { styles } = useStyles(stylesheet);
  const { searchState, setSearchQuery } = useSearch();
  const searchQuery = searchState["people"] || ""; // Usa un identificador único "people" para esta búsqueda
  const { people, peopleAreLoading, fetchPeople } = usePeople();
  const [filteredPeople, setFilteredPeople] = useState(people); // Lista de personas filtradas

  const capitalizeWords = (text: string | null | undefined): string => {
    if (!text) return ""; // Verifica si el texto es nulo, indefinido o vacío
    return text
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  useEffect(() => {
    // Filtrar personas basadas en la consulta de búsqueda
    if (searchQuery && people) {
      const filtered = people.filter((person) =>
        `${person.name} ${person.father_last_name} ${person.mother_last_name}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
      setFilteredPeople(filtered);
    } else {
      setFilteredPeople(people); // Si no hay búsqueda, mostrar todas las personas
    }
  }, [searchQuery, people]);

  if (peopleAreLoading) {
    return <LoadingScreen caption="Cargando personas" />;
  }

  if (isProfileLoading) {
    return <LoadingScreen caption="Cargando perfil y permisos" />;
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

  if (!people) {
    return (
      <ErrorScreen
        caption={`Ocurrió un error y no \npudimos cargar las personas`}
        buttonCaption="Reintentar"
        retryFunction={fetchPeople}
      />
    );
  }

  if (filteredPeople?.length === 0) {
    return <EmptyScreen caption="Ningún resultado" />;
  }

  const isAdminOrOwner = profile.role === "ADMIN" || profile.role === "OWNER";

  if (isAdminOrOwner) {
    return (
      <FlatList
        refreshing={peopleAreLoading}
        onRefresh={fetchPeople}
        contentInsetAdjustmentBehavior="automatic"
        data={filteredPeople}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Link href={{ pathname: `/people/${item.id}` }} asChild>
            <Pressable>
              <View style={styles.container}>
                <View style={styles.contentContainer}>
                  <View style={styles.imageContainer}>
                    <PictureUpload size={60} />
                  </View>
                  <Text
                    style={styles.itemText}
                  >{`${capitalizeWords(item.name)} ${capitalizeWords(item.father_last_name)} ${capitalizeWords(item.mother_last_name)}`}</Text>
                </View>
                <View style={styles.chevronView}>
                  <ChevronRight color={styles.chevron.color} />
                </View>
              </View>
            </Pressable>
          </Link>
        )}
      />
    );
  } else {
    return <Redirect href={"/vehicles"} />;
  }
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
    color: theme.ui.colors.primary,
  },
  chevron: {
    color: theme.textPresets.subtitle,
  },
  chevronView: {
    paddingRight: 12,
  },
}));
