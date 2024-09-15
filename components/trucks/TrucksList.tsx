import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  Pressable,
  Image,
} from "react-native";
import useTruck from "@/hooks/truckHooks/useTruck";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { Link, Stack } from "expo-router";
import AddTruckComponent from "./AddTruckComponent";
import { useEffect, useState } from "react";
import { ChevronRight, Plus, PlusIcon } from "lucide-react-native";
import { useSearch } from "@/context/SearchContext";
import useProfile from "@/hooks/useProfile";

export default function TrucksList() {
  const { trucks, loading } = useTruck({ isComplete: false });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [filteredTrucks, setFilteredTrucks] = useState(trucks);
  const { role } = useProfile();
  const { styles } = useStyles(stylesheet);
  const { searchState } = useSearch();
  const searchQuery = searchState["trucks"] || "";

  const capitalizeWords = (text: string | null | undefined): string => {
    if (!text) return ""; // Verifica si el texto es nulo, indefinido o vacío
    return text
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  useEffect(() => {
    if (searchQuery) {
      const filtered = trucks.filter((truck) =>
        `${truck.economic_number} ${truck.brand} ${truck.sub_brand} (${truck.year})`
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
      setFilteredTrucks(filtered);
    } else {
      setFilteredTrucks(trucks);
    }
  }, [searchQuery, trucks]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <>
      {role === "ADMIN" && (
        <Stack.Screen
          options={{
            headerRight: () => (
              <Pressable onPress={() => setIsModalVisible(true)}>
                <Plus color={styles.plusIcon.color} />
              </Pressable>
            ),
          }}
        />
      )}
      <FlatList
        contentInsetAdjustmentBehavior="automatic"
        data={filteredTrucks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Link href={{ pathname: `/trucks/${item.id}` }} asChild>
            <Pressable>
              <View style={styles.container}>
                <View style={styles.contentContainer}>
                  <View style={styles.imageContainer}>
                    <Image
                      style={styles.image}
                      source={{ uri: "https://placehold.co/512x512.png" }}
                    />
                  </View>
                  <Text style={styles.itemText}>
                    <Text
                      style={{ fontWeight: "bold" }}
                    >{`${capitalizeWords(item.brand)} ${item.sub_brand} (${item.year})\n`}</Text>
                    {`Placas: ${item.plate}\n`}
                    {`Número económico: ${item.economic_number}\n`}
                  </Text>
                </View>
                <View style={styles.chevronView}>
                  <ChevronRight color={styles.chevron.color} />
                </View>
              </View>
            </Pressable>
          </Link>
        )}
      />
      <AddTruckComponent
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      />
    </>
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
    width: 100,
    height: 100,
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
