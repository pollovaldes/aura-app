import GroupedList from "@/components/grouped-list/GroupedList";
import Row from "@/components/grouped-list/Row";
import { ScrollView, Appearance, useColorScheme, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { Stack, useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import { Moon, Sun, SunMoon } from "lucide-react-native";
import { colorPalette } from "@/style/themes";
import { RadioButton } from "@/components/radioButton/RadioButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";

export default function Index() {
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
              trailing={
                <RadioButton
                  selected={selectedOption === "dark"}
                  onPress={() => handleRadioChange("dark")}
                />
              }
            />
            <Row
              title="Claro"
              icon={Sun}
              backgroundColor={colorPalette.neutral[500]}
              onPress={() => handleRadioChange("light")}
              trailing={
                <RadioButton
                  selected={selectedOption === "light"}
                  onPress={() => handleRadioChange("light")}
                />
              }
            />
            <Row
              title="Automático"
              icon={SunMoon}
              backgroundColor={colorPalette.neutral[500]}
              onPress={() => handleRadioChange("auto")}
              trailing={
                <RadioButton
                  selected={selectedOption === "auto"}
                  onPress={() => handleRadioChange("auto")}
                />
              }
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
