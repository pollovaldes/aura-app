import GroupedList from "@/components/grouped-list/GroupedList";
import Row from "@/components/grouped-list/Row";
import { ScrollView, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { router, Stack } from "expo-router";
import React from "react";
import { Code, GlobeLock, Handshake } from "lucide-react-native";
import { colorPalette } from "@/style/themes";
import { openBrowserAsync } from "expo-web-browser";

export default function ProfileAbout() {
  const { styles } = useStyles(stylesheet);

  return (
    <>
      <Stack.Screen
        options={{
          title: "Sobre Aura",
          headerLargeTitle: true,
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
              onPress={() => router.push("./licenses", { relativeToDirectory: true })}
            />
            <Row
              title="Términos"
              icon={Handshake}
              backgroundColor={colorPalette.orange[500]}
              onPress={() => openBrowserAsync("https://raw.githubusercontent.com/pollovaldes/aura-app/main/terms.txt")}
            />
            <Row
              title="Política de privacidad"
              icon={GlobeLock}
              backgroundColor={colorPalette.neutral[500]}
              onPress={() =>
                openBrowserAsync("https://raw.githubusercontent.com/pollovaldes/aura-app/main/privacy-policy.txt")
              }
            />
            <Row title="Versión" caption={"1.0.0"} hideChevron />
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
