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
              icon={<Code size={24} color="white" />}
              color={colorPalette.green[500]}
              trailingType="chevron"
              onPress={() =>
                router.push("./licenses", { relativeToDirectory: true })
              }
            />
            <Row
              title="Términos"
              icon={<Handshake size={24} color="white" />}
              color={colorPalette.orange[500]}
              trailingType="chevron"
              onPress={() =>
                openBrowserAsync(
                  "https://raw.githubusercontent.com/pollovaldes/aura-app/main/terms.txt"
                )
              }
            />
            <Row
              title="Política de privacidad"
              icon={<GlobeLock size={24} color="white" />}
              color={colorPalette.neutral[500]}
              trailingType="chevron"
              onPress={() =>
                openBrowserAsync(
                  "https://raw.githubusercontent.com/pollovaldes/aura-app/main/privacy-policy.txt"
                )
              }
            />
            <Row
              title="Versión"
              caption={"1.0.0"}
              trailingType="chevron"
              showChevron={false}
              pressedStyle={false}
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
