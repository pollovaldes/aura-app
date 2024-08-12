import React from "react";
import { Stack, useLocalSearchParams } from "expo-router";
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  Image,
  ScrollView,
} from "react-native";
import { Link } from "expo-router";
import TruckHandler from "@/components/trucks/TrucksMainLogic";
import { createStyleSheet, useStyles } from "react-native-unistyles";

export default function TruckDetail() {
  const { trucks } = TruckHandler();
  const { truckId } = useLocalSearchParams<{ truckId: string }>();
  const { styles } = useStyles(stylesheet);

  const truck = trucks.find((truck) => truck.id === parseInt(truckId!));
  const truckTitle = `${truck?.marca ?? ""} ${truck?.submarca ?? ""} ${truck?.modelo ?? ""}`;

  return (
    <>
      <Stack.Screen options={{ title: truckTitle }} />
      <ScrollView
        style={styles.container}
        contentInsetAdjustmentBehavior="automatic"
      >
        <View style={styles.imageContainer}>
          <Image
            style={styles.image}
            source={{ uri: "https://placehold.co/2048x2048.png" }}
          />
        </View>
        <Link href={`/trucks/${truckId}/details`} asChild>
          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>Detalles</Text>
          </Pressable>
        </Link>
        <Link href={`/trucks/${truckId}/documentation`} asChild>
          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>Documentación</Text>
          </Pressable>
        </Link>
        <Link href={`/trucks/${truckId}/gasoline`} asChild>
          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>Gasolina</Text>
          </Pressable>
        </Link>
        <Link href={`/trucks/${truckId}/peopleAdmin`} asChild>
          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>Administrar Personas</Text>
          </Pressable>
        </Link>
      </ScrollView>
    </>
  );
}

const stylesheet = createStyleSheet({
  container: {
    flex: 1,
  },
  imageContainer: {},
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  image: {
    width: "100%",
    height: 250,
  },
  button: {
    backgroundColor: "#add8e6", // Azul claro
    borderColor: "#000", // Borde negro
    borderWidth: 1,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginVertical: 10,
    borderRadius: 15,
    width: "100%", // Ancho completo
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000", // Texto negro
  },
});
