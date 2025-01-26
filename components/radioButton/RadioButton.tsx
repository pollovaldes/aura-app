import React from "react";
import { TouchableOpacity, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

interface RadioButtonProps {
  selected: boolean;
  onPress: () => void;
}

export function RadioButton({ selected, onPress }: RadioButtonProps) {
  const { styles } = useStyles(stylesheet);

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.circle}>
        <View
          style={[
            styles.fill,
            {
              backgroundColor: selected ? styles.selectedCircle.backgroundColor : "transparent",
            },
          ]}
        />
      </View>
    </TouchableOpacity>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  circle: {
    height: 25,
    width: 25,
    borderRadius: 12.5,
    borderWidth: 2,
    borderColor: theme.ui.colors.border,
    justifyContent: "center",
    alignItems: "center",
  },
  fill: {
    height: 12,
    width: 12,
    borderRadius: 6,
  },
  selectedCircle: {
    backgroundColor: theme.ui.colors.primary,
  },
}));
