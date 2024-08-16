import React from "react";
import { router, Stack, useLocalSearchParams } from "expo-router";
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
import GroupedList from "@/components/grouped-list/GroupedList";
import Row from "@/components/grouped-list/Row";

export default function TruckDetail() {
  const { trucks } = TruckHandler();
  const { truckId } = useLocalSearchParams<{ truckId: string }>();
  const { styles } = useStyles(stylesheet);

  const truck = trucks.find((truck) => truck.id === parseInt(truckId!));
  const truckTitle = `${truck?.marca ?? ""} ${truck?.submarca ?? ""} ${truck?.modelo ?? ""}`;

  return (
    <>
      <Stack.Screen options={{ title: truckTitle }} />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View style={styles.container}>
          <View style={styles.imageContainer}>
            <Image
              style={styles.image}
              source={{ uri: "https://placehold.co/2048x2048.png" }}
            />
          </View>
          <GroupedList
            header="Consulta"
            footer="Ve distintos datos a lo largo del tiempo o actuales sobre este camión."
          >
            <Row title="Galeria" trailingType="chevron" />
            <Row
              title="Ficha técnica"
              trailingType="chevron"
              onPress={() => router.navigate(`/trucks/${truckId}/details`)}
            />
            <Row
              title="Guantera digital"
              trailingType="chevron"
              onPress={() =>
                router.navigate(`/trucks/${truckId}/documentation`)
              }
            />
            <Row title="Histórico de rutas" trailingType="chevron" />
            <Row
              title="Histórico de cargas de gasolina"
              trailingType="chevron"
              onPress={() => router.navigate(`/trucks/${truckId}/gasoline`)}
            />
          </GroupedList>
          <GroupedList header="Acciones" footer="Alguna descripción.">
            <Row
              title="Administrar personas"
              trailingType="chevron"
              onPress={() => router.navigate(`/trucks/${truckId}/people`)}
            />
            <Row title="Registrar carga de gasolina" trailingType="chevron" />
            <Row title="Solicitar mantenimiento" trailingType="chevron" />
          </GroupedList>
          <View />
        </View>
      </ScrollView>
    </>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  container: {
    flex: 1,
    gap: theme.marginsComponents.section,
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
}));
