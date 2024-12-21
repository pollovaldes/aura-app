// The Visuals of the PeopleAdmin Component

import GroupedList from "@/components/grouped-list/GroupedList";
import Row from "@/components/grouped-list/Row";
import usePeople from "@/hooks/peopleHooks/useUsers";
import useUsers from "@/hooks/peopleHooks/useUsers";
import { Stack, useLocalSearchParams } from "expo-router";
import { View, Text, ActivityIndicator, ScrollView } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

export default function TruckPeopleAdminComponent() {
  const { styles } = useStyles(stylesheet);
  const { users, usersAreLoading, fetchUsers } = useUsers();

  const { personId } = useLocalSearchParams<{ personId: string }>();
  const user = users?.find((user) => user.id === personId);

  if (usersAreLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Stack.Screen options={{ title: "", headerBackTitle: "Info" }} />
        <ActivityIndicator />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.details}>Este usuario no existe</Text>
        <Stack.Screen options={{ title: "Error", headerBackTitle: "Info" }} />
      </View>
    );
  }

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <View style={styles.container}>
        <Stack.Screen
          options={{
            title: `${user.name} ${user.father_last_name}`,
            headerBackTitle: "Info",
            headerShown: true,
          }}
        />
        <GroupedList
          header="Detalles"
          footer="Para obtener más información o reportar errores, por favor comuníquese con su supervisor."
        >
          <Row
            title="Nombre"
            caption={`${user.name}`}
            hideChevron
            disabled={true}
          />
          <Row
            title="Apellido Paterno"
            caption={`${user.father_last_name}`}
            hideChevron
            disabled={true}
          />
          <Row
            title="Apellido Materno"
            caption={`${user.mother_last_name}`}
            hideChevron
            disabled={true}
          />
          <Row
            title="Posición"
            caption={`${user.position}`}
            hideChevron
            disabled={true}
          />
        </GroupedList>
      </View>
    </ScrollView>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  container: {
    gap: theme.marginsComponents.section,
    marginTop: theme.marginsComponents.section, //Excepción
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: theme.textPresets.main,
  },
  details: {
    fontSize: 18,
    color: theme.textPresets.main,
  },
}));
