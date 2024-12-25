import GroupedList from "@/components/grouped-list/GroupedList";
import Row from "@/components/grouped-list/Row";
import { ScrollView, Appearance, useColorScheme, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { Stack } from "expo-router";
import React, { useState } from "react";
import { Moon, Sun, SunMoon } from "lucide-react-native";
import { colorPalette } from "@/style/themes";
import { RadioButton } from "@/components/radioButton/RadioButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import { AccentColorPicker } from "./components/AccentColorPicker";

export default function ProfileAccentColor() {
  const { styles } = useStyles(stylesheet);
  const [selectedOption, setSelectedOption] = useState("auto");
  const currentTheme = useColorScheme();

  const handleRadioChange = async (option: string) => {
    try {
      setSelectedOption(option);

      switch (option) {
        case "light":
          Appearance.setColorScheme("light"); // Explicitly set the color scheme to light
          break;
        case "dark":
          Appearance.setColorScheme("dark"); // Explicitly set the color scheme to dark
          break;
        case "auto":
          Appearance.setColorScheme(currentTheme); // Use the system's color scheme
          break;
        default:
          console.warn("Invalid color scheme option");
      }

      await AsyncStorage.setItem("appTheme", option);
    } catch (error) {
      alert("Ocurrió un error al cambiar el tema de la aplicación");
    }
  };

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
              {/* Here is our reusable accent color picker */}
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
