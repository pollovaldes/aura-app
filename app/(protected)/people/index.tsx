import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  Pressable,
} from "react-native";
import usePeople from "@/hooks/peopleHooks/usePeople";
import AddPeopleComponent from "@/components/people/AddPeopleComponent";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { Link, Redirect } from "expo-router";
import { useState } from "react";
import { useAuth } from "@/context/SessionContext";

export default function Page() {
  const { isAdmin } = useAuth();
  const { people, loading } = usePeople();
  const { styles } = useStyles(stylesheet);
  const [isModalVisible, setIsModalVisible] = useState(false);
  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator />
      </View>
    );
  }

  if(isAdmin) {
    return (
      <>
        <FlatList
          data={people}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            return (
            <Link href={{ pathname: `/people/${item.id}` }} asChild>
              <Pressable style={styles.itemContainer}>
                <Text
                  style={styles.itemText}
                >{`${item.nombre} ${item.apellido_paterno} ${item.apellido_materno}`}</Text>
              </Pressable>
            </Link>
          )}}
        />
        <Pressable style={styles.addButton} onPress={() => setIsModalVisible(true)}>
          <Text 
            style={[styles.itemText, {fontWeight: "bold"}, {color: "white"}]}
            >Añadir Conductor</Text>
        </Pressable>
  
        <AddPeopleComponent visible={isModalVisible} onClose={() => setIsModalVisible(false)} />
      </>
    );
  }
  else {
    return <Redirect href={'/trucks'}/>
  }
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
