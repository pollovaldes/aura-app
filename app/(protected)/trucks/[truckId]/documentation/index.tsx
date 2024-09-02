import { View, Text, ActivityIndicator, ScrollView, Alert } from "react-native";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { useAuth } from "@/context/SessionContext";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import GroupedList from "@/components/grouped-list/GroupedList";
import Row from "@/components/grouped-list/Row";

export default function Index() {
  const { styles } = useStyles(stylesheet);
  const { isAdmin } = useAuth();
  const { truckId } = useLocalSearchParams<{ truckId: string }>();

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <View style={styles.container}>
        <Stack.Screen options={{ title: 'Guantera Digital'}} />
        <GroupedList
          header="Documentos"
          footer="Solo los admins pueden ver toda la guantera digital y modificarla"
        >
          <Row
            title="Seguro"
            trailingType="chevron"
            onPress={() => router.navigate(`/trucks/[truckId]/documentation/iddeldocumento`) }  // Reemplazar el id del cocumento. Para Jackson: Aqui no se como funcione el storage pero en algun momento deberias tener que obtener el id de un documento, que seria algo asi como truckId.documentId
          />
          <Row
            title="Licencia"
            trailingType="chevron"
          />
          <Row
            title="Permiso de transporte de carga"
            trailingType="chevron"
          />
          <Row
            title="Certificado de inspección vehicular"
            trailingType="chevron"
          />
          <Row
            title="Manual Técnico"
            trailingType="chevron"
          />
          <Row
            title="Números de emergencia"
            trailingType="chevron"
          />

        </GroupedList>
      </View>
    </ScrollView>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  container: {
    gap: theme.marginsComponents.section,
    marginTop: theme.marginsComponents.section,
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
  details: {
    fontSize: 18,
    color: theme.textPresets.main,
  },
}));