import { LucideProps } from "lucide-react-native";
import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { Platform } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

export function ActionButton({
  show = true,
  onPress,
  text,
  Icon,
}: {
  show?: boolean;
  onPress: () => void;
  text?: string;
  Icon?: React.ComponentType<Partial<LucideProps>>;
}) {
  if (!show || (text && Icon)) return null;

  const { styles } = useStyles(stylesheet);

  return (
    <TouchableOpacity onPress={onPress} style={styles.pressable}>
      {Icon ? (
        <Icon color={styles.icon.color} size={styles.icon.fontSize} />
      ) : (
        text && (
          <Text style={styles.text} selectable={false} allowFontScaling={false}>
            {text}
          </Text>
        )
      )}
    </TouchableOpacity>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  pressable: {
    marginHorizontal: 8,
  },
  text: {
    color: theme.headerButtons.color,
    fontSize: 17.5,
  },
  icon: {
    fontSize: Platform.select({
      ios: 26,
      android: 25,
      web: 25,
    }),
    color: theme.headerButtons.color,
  },
}));
