import GroupedList from "@/components/grouped-list/GroupedList";
import Row from "@/components/grouped-list/Row";
import { ScrollView, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { router, Stack } from "expo-router";
import React from "react";
import { Info, LockKeyhole, Trash, Users } from "lucide-react-native";
import { colorPalette } from "@/style/themes";

export default function ProfileReport() {
  const { styles } = useStyles(stylesheet);

  return (
    <>
      <Stack.Screen
        options={{
          title: "Reportar un problema",
          headerLargeTitle: true,
          headerRight: undefined,
        }}
      />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View style={styles.container}>
          <GroupedList header="Opciones de la cuenta">
            <Row
              title="Información de la cuenta"
              icon={Info}
              backgroundColor={colorPalette.cyan[500]}
              onPress={() => router.push("./about", { relativeToDirectory: true })}
            />
            <Row
              title="Contraseña"
              icon={LockKeyhole}
              backgroundColor={colorPalette.orange[500]}
              onPress={() => router.push("./password", { relativeToDirectory: true })}
            />
            <Row
              title="Identidades"
              icon={Users}
              backgroundColor={colorPalette.emerald[500]}
              onPress={() => router.push("./identities", { relativeToDirectory: true })}
            />
            <Row
              title="Eliminar cuenta"
              icon={Trash}
              backgroundColor={colorPalette.red[500]}
              onPress={() => alert("Esta acción no se puede deshacer. ¿Estás seguro?")}
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
    gap: theme.marginsComponents.section,
    marginTop: theme.marginsComponents.section,
  },
}));
