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
import { useState } from "react";
import { useAuth } from "@/context/SessionContext";
import { ChevronRight, Plus } from "lucide-react-native";
import AddTruckComponent from "../trucks/AddTruckComponent";

export default function PeopleList() {
  const { isAdmin } = useAuth();
  const { people, loading } = usePeople({ isComplete: false });
  const { styles } = useStyles(stylesheet);
  const [isModalVisible, setIsModalVisible] = useState(false);

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
        {isAdmin && (
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
          data={people}
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
                    <Text
                      style={styles.itemText}
                    >{`${item.nombre} ${item.apellido_paterno} ${item.apellido_materno}`}</Text>
                  </View>
                  <View style={styles.chevronView}>
                    <ChevronRight color={styles.chevron.color} />
                  </View>
                </View>
              </Pressable>
            </Link>
          )}
        />
        <AddTruckComponent // This should be AddPeopleComponent
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
        />
      </>
    );
  }
  else {
    return <Redirect href={'/trucks'} />
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
