import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  Pressable,
  Image,
} from "react-native";
import usePeople from "@/hooks/peopleHooks/usePeople";
import AddPeopleComponent from "@/components/people/AddPeopleComponent";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { Link, Redirect, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/SessionContext";
import { ChevronRight, Plus } from "lucide-react-native";
import { useSearch } from "@/context/SearchContext";

export default function PeopleList() {
  const { isAdmin } = useAuth();
  const { people, loading } = usePeople({ isComplete: false });
  const { styles } = useStyles(stylesheet);
  const { searchState, setSearchQuery } = useSearch();

  const searchQuery = searchState["people"] || ""; // Usa un identificador único "people" para esta búsqueda
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
    if (searchQuery) {
      const filtered = people.filter((person) =>
        `${person.nombre} ${person.apellido_paterno} ${person.apellido_materno}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
      setFilteredPeople(filtered);
    } else {
      setFilteredPeople(people); // Si no hay búsqueda, mostrar todas las personas
    }
  }, [searchQuery, people]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator />
      </View>
    );
  }

  if (isAdmin) {
    return (
      <>
        <FlatList
          contentInsetAdjustmentBehavior="automatic"
          data={filteredPeople}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Link href={{ pathname: `/people/${item.id}` }} asChild>
              <Pressable>
                <View style={styles.container}>
                  <View style={styles.contentContainer}>
                    <View style={styles.imageContainer}>
                      <Image
                        style={styles.image}
                        source={{ uri: "https://placehold.co/128x128.png" }}
                      />
                    </View>
                    <Text
                      style={styles.itemText}
                    >{`${capitalizeWords(item.nombre)} ${capitalizeWords(item.apellido_paterno)} ${capitalizeWords(item.apellido_materno)}`}</Text>
                  </View>
                  <View style={styles.chevronView}>
                    <ChevronRight color={styles.chevron.color} />
                  </View>
                </View>
              </Pressable>
            </Link>
          )}
        />
      </>
    );
  } else {
    return <Redirect href={"/trucks"} />;
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
