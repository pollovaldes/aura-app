import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  Pressable,
} from "react-native";
import PeopleMainLogic from "./PeopleMainLogic";
import AddPeopleComponent from "./AddPeopleComponent";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { Link } from "expo-router";
import { useState } from "react";

export default function PeopleMainScreen() {
  const { people, loading } = PeopleMainLogic();
  const { styles } = useStyles(stylesheet);
  const [isModalVisible, setIsModalVisible] = useState(false);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <>
      <FlatList
        data={people}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Link href={{ pathname: `/people/${item.id}` }} asChild>
            <Pressable style={styles.itemContainer}>
              <Text
                style={styles.itemText}
              >{`${item.nombre} ${item.apellido_paterno} ${item.apellido_materno}`}</Text>
            </Pressable>
          </Link>
        )}
      />
      <Pressable style={styles.addButton} onPress={() => setIsModalVisible(true)}>
        <Text 
          style={[styles.itemText, {fontWeight: "bold"}, {color: "white"}]}
          >Añadir Conducor</Text>
      </Pressable>

      <AddPeopleComponent visible={isModalVisible} onClose={() => setIsModalVisible(false)} />
    </>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  itemContainer: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.ui.colors.border,
    width: "100%",
  },
  itemText: {
    fontSize: 18,
    paddingLeft: 10,
    color: theme.textPresets.main,
  },
  addButton: {
    padding: 12,  //TODO: Crear theme.ui.colors.button
    width: "100%",
    backgroundColor: theme.ui.colors.primary,
    alignItems: "center",
  }
}));
