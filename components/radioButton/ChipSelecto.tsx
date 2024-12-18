import React from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

interface RoleChangeSelectorProps {
  selected: boolean;
  caption: string;
  disabled?: boolean;
  onPress: () => void;
}

export function ChipSelecto({
  selected,
  onPress,
  caption,
  disabled,
}: RoleChangeSelectorProps) {
  const { styles } = useStyles(stylesheet);

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: selected
            ? styles.selected.backgroundColor
            : styles.unselected.backgroundColor,
        },
      ]}
      disabled={disabled}
      onPress={onPress}
    >
      <Text
        style={[
          styles.text,
          { color: selected ? styles.selected.color : styles.unselected.color },
        ]}
      >
        {caption}
      </Text>
    </TouchableOpacity>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  container: {
    paddingVertical: 6,
    borderRadius: 20,
    width: 150,
    height: 40,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: theme.ui.colors.border,
  },
  text: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  selected: {
    backgroundColor: theme.ui.colors.primary,
    color: "#fff",
  },
  selectedDisabled: {
    backgroundColor: theme.ui.colors.card,
    color: "#fff",
  },
  unselected: {
    backgroundColor: "transparent",
    color: theme.textPresets.main,
  },
}));
