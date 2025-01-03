import React from "react";
import { View, TouchableOpacity, StyleSheet, Platform, Text } from "react-native";
import { ACCENT_COLORS, AccentColorName } from "@/style/accentColor";
import * as Haptics from "expo-haptics";
import { useAccentColor } from "@/features/global/hooks/useAccentColor";
import { UnistylesRuntime } from "react-native-unistyles";

function chunkArray(array: AccentColorName[], chunkSize: number): AccentColorName[][] {
  const results: AccentColorName[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    results.push(array.slice(i, i + chunkSize));
  }
  return results;
}

export function AccentColorPicker() {
  const colorScheme = UnistylesRuntime.colorScheme;
  const { accentColor, handleColorPress } = useAccentColor();
  const colorNames = Object.keys(ACCENT_COLORS) as AccentColorName[];
  const rows = chunkArray(colorNames, 4);

  const hapticFeedback = async () => {
    if (Platform.OS !== "web") {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const handlePress = async (colorName: AccentColorName) => {
    await hapticFeedback();
    handleColorPress(colorName);
  };

  return (
    <View style={styles.container}>
      {rows.map((rowColors, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {rowColors.map((colorName) => {
            const circleColor = ACCENT_COLORS[colorName][colorScheme === "dark" ? "dark" : "light"];
            const isSelected = colorName === accentColor;

            return (
              <TouchableOpacity
                key={colorName}
                onPress={() => handlePress(colorName)}
                activeOpacity={0.7}
                style={styles.touchable}
              >
                <View
                  style={[
                    styles.circle,
                    {
                      backgroundColor: circleColor,
                      borderWidth: isSelected ? 3 : 0,
                      borderColor: isSelected ? (colorScheme === "dark" ? "#fff" : "#000") : "transparent",
                    },
                  ]}
                />
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    alignItems: "center",
  },
  heading: {
    fontSize: 18,
    marginBottom: 16,
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "107%",
    marginBottom: 16,
  },
  circle: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  touchable: {
    padding: 4,
  },
});
