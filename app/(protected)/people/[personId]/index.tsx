import React from "react";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { View, Image, ScrollView } from "react-native";
import TruckHandler from "@/components/trucks/TrucksMainLogic";
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
import PeopleMainLogic from "@/components/people/PeopleMainLogic";

export default function PeopleDetail() {
  const { people } = PeopleMainLogic();
  const { personId } = useLocalSearchParams<{ personId: string }>();
  const { styles } = useStyles(stylesheet);

  const user = people.find((truck) => truck.id === personId!);
  const peopleTitle = `${user?.nombre ?? ""} ${user?.apellido_paterno ?? ""} ${user?.apellido_materno ?? ""}`;

  return (
    <>
      <Stack.Screen options={{ title: peopleTitle }} />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View style={styles.container}>
          <View style={styles.imageContainer}>
            <Image
              style={styles.image}
              source={{ uri: "https://placehold.co/2048x2048.png" }}
            />
          </View>
          <GroupedList
            header="Datos"
            footer="Asigna roles a los conductores o pide que te asignen un rol"
          >
            <Row
              title="Información del conductor"
              trailingType="chevron"
              onPress={() => router.navigate(`/people/${personId}/details`)}
              icon={<Clipboard size={24} color="white" />}
              color={colorPalette.emerald[500]}
            />
            <Row
              title="Cambiar Role"
              trailingType="chevron"
              onPress={() => router.navigate(`/people/${personId}/changeRole`)}
              icon={<Clipboard size={24} color="white" />}
              color={colorPalette.emerald[500]}
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
