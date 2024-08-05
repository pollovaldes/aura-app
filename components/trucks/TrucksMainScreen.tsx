import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  Pressable,
} from "react-native";
import TruckHandler from "@/components/trucks/TrucksMainLogic";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { Link } from "expo-router";

export default function TruckList() {
  const { trucks, loading } = TruckHandler();
  const { styles } = useStyles(stylesheet);

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
        data={trucks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Link href={{ pathname: `/trucks/${item.id}` }} asChild>
            <Pressable style={styles.itemContainer}>
              <Text
                style={styles.itemText}
              >{`${item.marca} ${item.submarca} (${item.modelo})`}</Text>
            </Pressable>
          </Link>
        )}
      />
      <Link href={{ pathname: `/trucks/1` }} asChild>
        <Pressable style={styles.itemContainer}>
          <Text style={styles.itemText}>Huevos</Text>
        </Pressable>
      </Link>
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
}));
