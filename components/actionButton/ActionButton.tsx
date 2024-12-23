import { LucideProps } from "lucide-react-native";
import React, { useState } from "react";
import { Pressable, Text, TouchableOpacity, useWindowDimensions, View } from "react-native";
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
  text: string;
  Icon?: React.ComponentType<Partial<LucideProps>>;
}) {
  if (!show) return null;

  const { styles } = useStyles(stylesheet);
  const { width } = useWindowDimensions();
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  // Mobile (iOS, Android) and Web (width <= 750)
  const isMobileOrSmallScreen =
    Platform.OS === "ios" || Platform.OS === "android" || (Platform.OS === "web" && width <= 650);

  // Button logic for mobile or small web screens
  if (isMobileOrSmallScreen) {
    return (
      <TouchableOpacity onPress={onPress}>
        {Icon ? (
          <Icon color={styles.icon(width).color} size={styles.icon(width).fontSize} />
        ) : (
          <Text style={styles.text} selectable={false}>
            {text}
          </Text>
        )}
      </TouchableOpacity>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      style={[styles.container, isHovered && styles.containerHovered, isPressed && styles.containerPressed]}
    >
      {Icon && <Icon color={styles.icon(width).color} size={styles.icon(width).fontSize} />}
      {text && (
        <Text style={styles.text} selectable={false} allowFontScaling={false}>
          {text}
        </Text>
      )}
    </Pressable>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.ui.colors.border,
  },
  containerHovered: {
    backgroundColor: theme.components.plainList.hover,
  },
  containerPressed: {
    backgroundColor: theme.components.plainList.pressed,
  },
  text: {
    color: theme.headerButtons.color,
    fontSize: Platform.select({
      ios: 16,
      android: 16,
      web: 15,
    }),
    marginLeft: 8,
  },
  icon: (width: number) => ({
    fontSize: Platform.select({
      ios: 26,
      android: 25,
      web: width <= 650 ? 25 : 16,
    }),
    color: theme.headerButtons.color,
  }),
}));
