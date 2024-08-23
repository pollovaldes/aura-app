// The Visuals of the PeopleAdmin Component

import GroupedList from "@/components/grouped-list/GroupedList";
import Row from "@/components/grouped-list/Row";
import { Stack } from "expo-router";
import { View, Text, ActivityIndicator, ScrollView } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

type Person = {
  id: string;
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  email: string;
  phone: string;
  registrado: boolean;
}

type Props = {
  user: Person | null;
  loading: boolean;
};

export default function TruckPeopleAdminComponent({ user, loading }: Props) {
  const { styles } = useStyles(stylesheet);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator />
        <Stack.Screen options={{ title: "", headerBackTitle: "Info" }} />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.details}>Este usuario no existe</Text>
        <Stack.Screen options={{ title: "Error", headerBackTitle: "Info"}} />
      </View>
    );
  }

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <View style={styles.container}>
        <Stack.Screen options={{ title: `${user.nombre} ${user.apellido_paterno}`, headerBackTitle: "Info"}} />
        <GroupedList
            header="Detalles"
            footer="Si necesitas más información, contacta a tu administrador y si vez algun error contacta a tu supervisor, solo los administradores pueden editar la información del camion."
          >
            <Row
              title="Nombre"
              trailingType="chevron"
              caption={`${user.nombre}`}
            />
            <Row
              title="Apellido Paterno"
              trailingType="chevron"
              caption={`${user.apellido_paterno}`}
            />
            <Row
              title="Apellido Materno"
              trailingType="chevron"
              caption={`${user.apellido_materno}`}
            />
            <Row
              title="Email"
              trailingType="chevron"
              caption={`${user.email}`}
            />
            <Row
              title="Phone"
              trailingType="chevron"
              caption={`${user.phone}`}
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
