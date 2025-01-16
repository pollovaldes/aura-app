import { LucideProps } from "lucide-react-native";
import React, { useState } from "react";
import { Pressable, Text, TouchableOpacity, View } from "react-native";
import { Platform } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { UnistylesRuntime } from "react-native-unistyles";

export function ActionButton({
  show = true,
  onPress,
  text,
  Icon,
  preventCollapsing = false,
}: {
  show?: boolean;
  onPress: () => void;
  text: string;
  Icon?: React.ComponentType<Partial<LucideProps>>;
  preventCollapsing?: boolean;
}) {
  if (!show) return null;

  const { styles } = useStyles(stylesheet);
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const isWeb = Platform.OS === "web";
  const screenWidth = UnistylesRuntime.screen.width;

  const isMobile = Platform.OS === "ios" || Platform.OS === "android";
  const isSmallWebScreen = isWeb && screenWidth <= 750;

  const isMobileOrSmallScreen = isMobile || (isSmallWebScreen && !preventCollapsing);

  if (isMobileOrSmallScreen) {
    return (
      <TouchableOpacity onPress={onPress}>
        {Icon ? (
          <Icon color={styles.icon.color} size={styles.icon.fontSize} />
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
      {Icon && (
        <View style={styles.iconContainer}>
          <Icon color={styles.icon.color} size={styles.icon.fontSize} />
        </View>
      )}
      {text && (
        <Text style={styles.text} selectable={false} allowFontScaling={false}>
          {text}
        </Text>
      )}
    </Pressable>
  );
}

const stylesheet = createStyleSheet((theme, runtime) => ({
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
  },
  icon: {
    fontSize: Platform.select({
      ios: 26,
      android: 25,
      web: runtime.screen.width <= 750 ? 25 : 16,
    }),
    color: Platform.OS === "ios" ? theme.ui.colors.primary : theme.colors.inverted,
  },
  iconContainer: {
    marginRight: 8,
  },
}));
