import GroupedList from "@/components/grouped-list/GroupedList";
import Row from "@/components/grouped-list/Row";
import { ScrollView, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { router, Stack } from "expo-router";
import React from "react";
import {
  Code,
  GlobeLock,
  Handshake,
  Info,
  LockKeyhole,
  Trash,
  Users,
} from "lucide-react-native";
import { colorPalette } from "@/style/themes";
import { openBrowserAsync } from "expo-web-browser";

export default function Index() {
  const { styles } = useStyles(stylesheet);

  return (
    <>
      <Stack.Screen
        options={{
          title: "Licensias de código abierto",
          headerLargeTitle: false,
          headerRight: undefined,
        }}
      />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View style={styles.container}>
          <GroupedList>
            <Row
              title="Licensias de código abierto"
              icon={Code}
              backgroundColor={colorPalette.green[500]}
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
