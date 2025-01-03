import GroupedList from "@/components/grouped-list/GroupedList";
import Row from "@/components/grouped-list/Row";
import { ScrollView, Appearance, View, Platform } from "react-native";
import { createStyleSheet, UnistylesRuntime, useStyles } from "react-native-unistyles";
import { Stack } from "expo-router";
import React, { useState } from "react";
import { Moon, Sun, SunMoon } from "lucide-react-native";
import { colorPalette } from "@/style/themes";
import { RadioButton } from "@/components/radioButton/RadioButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";

export function ProfileTheme() {
  const { styles } = useStyles(stylesheet);
  const [selectedOption, setSelectedOption] = useState("auto");

  const fixLightTheme = () => {
    UnistylesRuntime.setAdaptiveThemes(false);
    UnistylesRuntime.setTheme("light");
    if (Platform.OS !== "web") {
      Appearance.setColorScheme("light");
    }
  };
  const fixDarkTheme = () => {
    UnistylesRuntime.setAdaptiveThemes(false);
    UnistylesRuntime.setTheme("dark");
    if (Platform.OS !== "web") {
      Appearance.setColorScheme("dark");
    }
  };
  const fixAutoTheme = () => {
    UnistylesRuntime.setAdaptiveThemes(true);
    UnistylesRuntime.setTheme(UnistylesRuntime.colorScheme === "dark" ? "dark" : "light");
    if (Platform.OS !== "web") {
      Appearance.setColorScheme(null);
    }
  };

  const handleRadioChange = async (option: string) => {
    setSelectedOption(option);

    switch (option) {
      case "light":
        fixLightTheme();
        break;
      case "dark":
        fixDarkTheme();
        break;
      case "auto":
        fixAutoTheme();
        break;
      default:
        console.warn("Invalid color scheme option");
    }

    await AsyncStorage.setItem("appTheme", option);
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Tema de la app",
          headerLargeTitle: true,
          headerRight: undefined,
        }}
      />
      <StatusBar />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View style={styles.container}>
          <GroupedList>
            <Row
              title="Oscuro"
              icon={Moon}
              backgroundColor={colorPalette.neutral[500]}
              onPress={() => handleRadioChange("dark")}
              trailing={<RadioButton selected={selectedOption === "dark"} onPress={() => handleRadioChange("dark")} />}
            />
            <Row
              title="Claro"
              icon={Sun}
              backgroundColor={colorPalette.neutral[500]}
              onPress={() => handleRadioChange("light")}
              trailing={
                <RadioButton selected={selectedOption === "light"} onPress={() => handleRadioChange("light")} />
              }
            />
            <Row
              title="Automático"
              icon={SunMoon}
              backgroundColor={colorPalette.neutral[500]}
              onPress={() => handleRadioChange("auto")}
              trailing={<RadioButton selected={selectedOption === "auto"} onPress={() => handleRadioChange("auto")} />}
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
