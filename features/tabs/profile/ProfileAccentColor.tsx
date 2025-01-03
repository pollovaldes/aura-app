import GroupedList from "@/components/grouped-list/GroupedList";
import Row from "@/components/grouped-list/Row";
import { ScrollView, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { Stack } from "expo-router";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { AccentColorPicker } from "./AccentColorPicker";

export function ProfileAccentColor() {
  const { styles } = useStyles(stylesheet);

  return (
    <>
      <Stack.Screen
        options={{
          title: "Color de acento",
          headerLargeTitle: true,
          headerRight: undefined,
        }}
      />
      <StatusBar />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View style={styles.container}>
          <GroupedList
            header="Color de acento"
            footer="Elige un color de acento para personalizar la aplicación, tu elección se guardará en tu dispositivo."
          >
            <Row>
              <AccentColorPicker />
            </Row>
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
