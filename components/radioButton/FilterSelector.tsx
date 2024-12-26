import { useAccentTheme } from "@/context/AccentThemeContext";
import React from "react";
import { TouchableOpacity, ScrollView, Text } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

interface FilterOption {
  key: string;
  label: string;
}

interface FilterSelectorProps {
  options: FilterOption[];
  selected: string;
  onChange: (option: string) => void;
}

export function FilterSelector({ options, selected, onChange }: FilterSelectorProps) {
  const { styles } = useStyles(stylesheet);
  const { accentColorHex } = useAccentTheme();

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {options.map((option) => (
        <TouchableOpacity
          key={option.key}
          style={[
            styles.filterButton,
            selected === option.key ? styles.selectedButton(accentColorHex) : styles.unselectedButton,
          ]}
          onPress={() => onChange(option.key)}
        >
          <Text style={[styles.text, selected === option.key ? styles.selectedText : styles.unselectedText]}>
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  selectedButton: (accentColor: string) => ({
    backgroundColor: accentColor,
    borderColor: accentColor,
  }),
  unselectedButton: {
    backgroundColor: "transparent",
    borderColor: theme.ui.colors.border,
  },
  text: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  selectedText: {
    color: "#fff",
  },
  unselectedText: {
    color: theme.textPresets.main,
  },
}));
