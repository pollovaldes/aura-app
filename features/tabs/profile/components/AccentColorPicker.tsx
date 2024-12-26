// AccentColorPicker.tsx
import React from "react";
import { View, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { useColorScheme } from "react-native";
import { useAccentTheme } from "@/context/AccentThemeContext"; // or wherever it's exported
import { ACCENT_COLORS, AccentColorName } from "@/style/accentColor";
import * as Haptics from "expo-haptics";

// Helper function to chunk the color array into rows of N
function chunkArray<T>(array: T[], chunkSize: number): T[][] {
  const results: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    results.push(array.slice(i, i + chunkSize));
  }
  return results;
}

export const AccentColorPicker: React.FC = () => {
  const colorScheme = useColorScheme(); // "light" or "dark"
  const { accentColor, setAccentColor } = useAccentTheme();

  // All color names, e.g. ["blue", "purple", "pink", "red", "orange", "yellow", "green", "grey"]
  const colorNames = Object.keys(ACCENT_COLORS) as AccentColorName[];
  // Chunk them into rows of 4 colors each
  const rows = chunkArray(colorNames, 4);

  const hapticFeedback = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  return (
    <View style={{ flexDirection: "column", gap: 24 }}>
      {rows.map((rowColors, rowIndex) => (
        <View
          key={rowIndex}
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            width: "104%",
          }}
        >
          {rowColors.map((colorName) => {
            // We pick the correct color (light or dark) from ACCENT_COLORS
            const circleColor = ACCENT_COLORS[colorName][colorScheme === "dark" ? "dark" : "light"];

            // Check if it’s the currently selected accent
            const isSelected = colorName === accentColor;

            return (
              <TouchableOpacity
                key={colorName}
                onPress={async () => {
                  await hapticFeedback();
                  setAccentColor(colorName);
                }}
                activeOpacity={0.7}
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
};

const styles = StyleSheet.create({
  circle: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
});
