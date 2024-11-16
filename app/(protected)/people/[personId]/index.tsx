import React from "react";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { View, ScrollView } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import GroupedList from "@/components/grouped-list/GroupedList";
import Row from "@/components/grouped-list/Row";
import { Info, SquarePen, Truck } from "lucide-react-native";
import { colorPalette } from "@/style/themes";
import ProfileColumn from "@/components/people/ProfileColumn";
import LoadingScreen from "@/components/dataStates/LoadingScreen";
import ErrorScreen from "@/components/dataStates/ErrorScreen";
import usePeople from "@/hooks/peopleHooks/usePeople";
import UnauthorizedScreen from "@/components/dataStates/UnauthorizedScreen";

export default function PeopleDetail() {
  const { personId } = useLocalSearchParams<{ personId: string }>();
  const { styles } = useStyles(stylesheet);
  const { people, fetchPeople, peopleAreLoading } = usePeople();

  if (peopleAreLoading) {
    return <LoadingScreen caption="Cargando perfil" />;
  }

  if (!people) {
    return (
      <ErrorScreen
        caption="Ocurrió un error al recuperar tu perfil"
        buttonCaption="Reintentar"
        retryFunction={fetchPeople}
      />
    );
  }

  const user = people.find((People) => People.id === personId);

  if (!user) {
    return (
      <>
        <Stack.Screen options={{ title: "Recurso inaccesible" }} />
        <UnauthorizedScreen
          caption="No tienes acceso a este recurso."
          buttonCaption="Reintentar"
          retryFunction={fetchPeople}
        />
      </>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{ headerShown: true, title: "", headerLargeTitle: false }}
      />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View style={styles.container}>
          <View style={styles.imageContainer}>
            <ProfileColumn profile={user} />
          </View>
          <GroupedList
            header="Datos"
            footer="Asigne roles a los usuarios o solicite que le sea asignado un rol."
          >
            <Row
              title="Información del conductor"
              trailingType="chevron"
              onPress={() => router.navigate(`/people/${personId}/details`)}
              icon={<Info size={24} color="white" />}
              color={colorPalette.cyan[500]}
            />
            <Row
              title="Cambiar Rol"
              trailingType="chevron"
              onPress={() => router.navigate(`/people/${personId}/changeRole`)}
              icon={<SquarePen size={24} color="white" />}
              color={colorPalette.orange[500]}
            />
          </GroupedList>
          <GroupedList
            header="Asignaciones"
            footer="Asigne un camión a su respectivo conductor."
          >
            <Row
              title="Asignar camión"
              trailingType="chevron"
              onPress={() => router.navigate(`/people/${personId}/assignTruck`)}
              icon={<Truck size={24} color="white" />}
              color={colorPalette.emerald[500]}
            />
          </GroupedList>
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
  imageContainer: {
    alignItems: "center",
  },
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
