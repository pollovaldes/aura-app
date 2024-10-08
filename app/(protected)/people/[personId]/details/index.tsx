// The Visuals of the PeopleAdmin Component

import GroupedList from "@/components/grouped-list/GroupedList";
import Row from "@/components/grouped-list/Row";
import usePeople from "@/hooks/peopleHooks/usePeople";
import { Stack, useLocalSearchParams } from "expo-router";
import { View, Text, ActivityIndicator, ScrollView } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

export default function TruckPeopleAdminComponent() {
  const { styles } = useStyles(stylesheet);
  const { people, peopleAreLoading } = usePeople();
  
  const { personId } = useLocalSearchParams<{ personId: string }>();
  const user = people?.find((People) => People.id === personId);

  if (peopleAreLoading) {
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
          footer="Si necesitas más información, contacta a tu administrador y si vez algun error contacta a tu supervisor."
        >
          <Row
            title="Nombre"
            trailingType="chevron"
            caption={`${user.name}`}
            showChevron={false}
            disabled={true}
          />
          <Row
            title="Apellido Paterno"
            trailingType="chevron"
            caption={`${user.father_last_name}`}
            showChevron={false}
            disabled={true}
          />
          <Row
            title="Apellido Materno"
            trailingType="chevron"
            caption={`${user.mother_last_name}`}
            showChevron={false}
            disabled={true}
          />
          <Row
            title="Posición"
            trailingType="chevron"
            caption={`${user.position}`}
            showChevron={false}
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
