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

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {options.map((option) => (
        <TouchableOpacity
          key={option.key}
          style={[styles.filterButton, selected === option.key ? styles.selectedButton : styles.unselectedButton]}
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
  selectedButton: {
    backgroundColor: theme.ui.colors.primary,
    borderColor: theme.ui.colors.primary,
  },
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
