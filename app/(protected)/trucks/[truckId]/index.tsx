import React from "react";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { View, Image, ScrollView, Alert } from "react-native";
import useTruck from "@/hooks/truckHooks/useTruck";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import GroupedList from "@/components/grouped-list/GroupedList";
import Row from "@/components/grouped-list/Row";
import {
  BookOpen,
  Clipboard,
  Fuel,
  Images,
  UsersRoundIcon,
  Waypoints,
  Wrench,
} from "lucide-react-native";
import { colorPalette } from "@/style/themes";

export default function TruckDetail() {
  const { trucks } = useTruck({ justOne: true ,isComplete: false });
  const { styles } = useStyles(stylesheet);
  const { truckId } = useLocalSearchParams<{ truckId: string }>();
  const truck = trucks[0]
  const truckTitle = `${truck?.marca ?? ""} ${truck?.sub_marca ?? ""} ${truck?.modelo ?? ""}`;

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
            <Row
              title="Galeria"
              trailingType="chevron"
              icon={<Images size={24} color="white" />}
              color={colorPalette.cyan[500]}
            />
            <Row
              title="Ficha técnica"
              trailingType="chevron"
              onPress={() => router.navigate(`/trucks/${truckId}/details`)}
              icon={<Clipboard size={24} color="white" />}
              color={colorPalette.emerald[500]}
            />
            <Row
              title="Guantera digital"
              trailingType="chevron"
              icon={<BookOpen size={24} color="white" />}
              color={colorPalette.orange[500]}
              onPress={() =>
                router.navigate(`/trucks/${truckId}/documentation`)
              }
            />
            <Row
              title="Histórico de rutas"
              trailingType="chevron"
              icon={<Waypoints size={24} color="white" />}
              color={colorPalette.lime[500]}
            />
            <Row
              title="Histórico de cargas de gasolina"
              trailingType="chevron"
              icon={<Fuel size={24} color="white" />}
              color={colorPalette.red[500]}
              onPress={() => router.navigate(`/trucks/${truckId}/gasoline`)}
            />
          </GroupedList>
          <GroupedList header="Acciones" footer="Alguna descripción.">
            <Row
              title="Administrar personas"
              trailingType="chevron"
              icon={<UsersRoundIcon size={24} color="white" />}
              color={colorPalette.sky[500]}
              onPress={() => router.navigate(`/trucks/${truckId}/people`)}
            />
            <Row
              title="Registrar carga de gasolina"
              trailingType="chevron"
              icon={<Fuel size={24} color="white" />}
              color={colorPalette.red[500]}
            />
            <Row
              title="Solicitar mantenimiento"
              trailingType="chevron"
              icon={<Wrench size={24} color="white" />}
              color={colorPalette.green[500]}
            />
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
