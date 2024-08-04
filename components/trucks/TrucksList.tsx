import { View, StyleSheet, Text, FlatList, ActivityIndicator, Pressable } from "react-native";
import TruckHandler from "@/components/trucks/ReadTrucks";
import { Dimensions } from "react-native";
import { Link } from "expo-router";

export default function TruckList() {
  const { trucks, loading } = TruckHandler();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Trucks</Text>
      <FlatList
        data={trucks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Link href={{ pathname: "/trucks/{}"}} asChild>
            <Pressable style={styles.itemContainer}>
              <Text style={styles.itemText}>{`${item.marca} ${item.submarca} (${item.modelo})`}</Text>
            </Pressable>
          </Link>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: "10%",
    justifyContent: "flex-start",
    backgroundColor: "white",
    height: Dimensions.get("window").height,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    paddingLeft: 20,
  },
  itemContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    width: "100%",
  },
  itemText: {
    fontSize: 18,
    paddingLeft: 10,
  },
});
