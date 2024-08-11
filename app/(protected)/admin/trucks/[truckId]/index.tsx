import React from "react";
import { Stack, useLocalSearchParams } from "expo-router";
import { Text, View, StyleSheet, Pressable } from "react-native";
import { Link } from "expo-router";
import TruckHandler from "@/components/trucks/TrucksMainLogic";

export default function TruckDetail() {
  const { trucks, loading } = TruckHandler();
  const { truckId } = useLocalSearchParams<{ truckId: string }>();

  const truck = trucks.find((truck) => truck.id === parseInt(truckId));

  return (
    <View style={styles.container}>
      <Stack.Screen options={{title:"Documentacion"}}/>
      <Text style={styles.title}>{truck?.marca} {truck?.submarca} {truck?.modelo}</Text>
      <Link href={`/admin/trucks/${truckId}/details`} asChild>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Detalles</Text>
        </Pressable>
      </Link>
      <Link href={`/admin/trucks/${truckId}/documentation`} asChild>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Documentación</Text>
        </Pressable>
      </Link>
      <Link href={`/admin/trucks/${truckId}/gasoline`} asChild>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Gasolina</Text>
        </Pressable>
      </Link>
      <Link href={`/admin/trucks/${truckId}/peopleAdmin`} asChild>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Administrar Personas</Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
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
