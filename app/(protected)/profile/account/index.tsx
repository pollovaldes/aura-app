import GroupedList from "@/components/grouped-list/GroupedList";
import Row from "@/components/grouped-list/Row";
import { ScrollView, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { Stack } from "expo-router";
import React from "react";
import { Info, LockKeyhole, Trash, Users } from "lucide-react-native";
import { colorPalette } from "@/style/themes";

export default function Index() {
  const { styles } = useStyles(stylesheet);

  return (
    <>
      <Stack.Screen
        options={{
          title: "Cuenta",
          headerLargeTitle: false,
          headerRight: undefined,
        }}
      />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View style={styles.container}>
          <GroupedList header="Opciones de la cuenta">
            <Row
              title="Información de la cuenta"
              icon={<Info size={24} color="white" />}
              color={colorPalette.cyan[500]}
              trailingType="chevron"
            />
            <Row
              title="Contraseña"
              icon={<LockKeyhole size={24} color="white" />}
              color={colorPalette.orange[500]}
              trailingType="chevron"
            />
            <Row
              title="Identidades"
              icon={<Users size={24} color="white" />}
              color={colorPalette.emerald[500]}
              trailingType="chevron"
            />
            <Row
              title="Eliminar cuenta"
              icon={<Trash size={24} color="white" />}
              color={colorPalette.red[500]}
              trailingType="chevron"
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
