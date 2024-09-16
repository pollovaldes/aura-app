import { View, Text, FlatList, Pressable } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { Link, Stack } from "expo-router";
import AddTruckComponent from "./AddTruckComponent";
import { useEffect, useState } from "react";
import { ChevronRight, Plus } from "lucide-react-native";
import { useSearch } from "@/context/SearchContext";
import useProfile from "@/hooks/useProfile";
import useTruck from "@/hooks/truckHooks/useTruck";
import LoadingScreen from "../dataStates/LoadingScreen";
import ErrorScreen from "../dataStates/ErrorScreen";
import EmptyScreen from "../dataStates/EmptyScreen";
import TruckThumbnail from "./TruckThumbnail";

export default function TrucksList() {
  const { trucks, trucksAreLoading, fetchTrucks } = useTruck();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [filteredTrucks, setFilteredTrucks] = useState(trucks);
  const { role } = useProfile();
  const { styles } = useStyles(stylesheet);
  const { searchState } = useSearch();
  const searchQuery = searchState["trucks"] || "";

  useEffect(() => {
    if (searchQuery && trucks) {
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

  if (trucksAreLoading) {
    return <LoadingScreen caption="Cargando vehículos" />;
  }

  if (trucks === null) {
    return (
      <ErrorScreen
        caption={`Ocurrió un error y no \npudimos cargar los vehículos`}
        buttonCaption="Reintentar"
        retryFunction={fetchTrucks}
      />
    );
  }

  if (trucks.length === 0) {
    return <EmptyScreen caption="Ningún vehículo por aquí" />;
  }

  if (filteredTrucks?.length === 0 && searchQuery) {
    return <EmptyScreen caption="Ningún resultado" />;
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
        refreshing={trucksAreLoading}
        onRefresh={fetchTrucks}
        contentInsetAdjustmentBehavior="automatic"
        data={filteredTrucks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Link href={{ pathname: `/trucks/${item.id}` }} asChild>
            <Pressable>
              <View style={styles.container}>
                <View style={styles.contentContainer}>
                  <View style={styles.imageContainer}>
                    <TruckThumbnail truckId={item.id} />
                  </View>
                  <Text style={styles.itemText}>
                    <Text
                      style={{ fontWeight: "bold" }}
                    >{`${item.brand} ${item.sub_brand} (${item.year})\n`}</Text>
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
    gap: 6,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: theme.textPresets.subtitle,
  },
  errorText: {
    color: "red",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  lackText: {
    fontSize: 16,
    color: theme.textPresets.main,
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
  emptyImageContainer: {
    borderRadius: 6,
    backgroundColor: theme.ui.colors.border,
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  noImageIcon: {
    color: theme.textPresets.main,
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
