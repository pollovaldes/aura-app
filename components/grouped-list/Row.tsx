import React, { ReactNode, useState } from "react";
import { View, Text, Pressable, ActivityIndicator, StyleProp, ViewStyle } from "react-native";
import RowIcon from "./RowIcon";
import { MaterialIcons } from "@expo/vector-icons";
import { LucideProps } from "lucide-react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

interface RowProps {
  title?: string;
  caption?: string | ReactNode;
  icon?: React.ComponentType<Partial<LucideProps>>;
  backgroundColor?: string;
  onPress?: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  trailing?: ReactNode;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  hideChevron?: boolean;
  hasTouchableFeedback?: boolean;
  show?: boolean;
}

const Row = ({
  title,
  caption,
  icon,
  backgroundColor = "#ffffff",
  onPress,
  isLoading = false,
  disabled = false,
  trailing,
  children,
  style,
  hideChevron = false,
  hasTouchableFeedback = true,
  show = true,
}: RowProps) => {
  const { styles, breakpoint } = useStyles(stylesheet);
  const isWide = breakpoint === "wide";
  const [isHovered, setIsHovered] = useState(false);

  if (!show) return;

  if (children) {
    return <View style={[styles.container, isWide && styles.containerWide, style]}>{children}</View>;
  }

  return (
    <Pressable
      onPress={onPress}
      disabled={isLoading || disabled || !onPress}
      onHoverIn={() => hasTouchableFeedback && setIsHovered(true)}
      onHoverOut={() => hasTouchableFeedback && setIsHovered(false)}
      style={({ pressed }) => [
        styles.container,
        isWide && styles.containerWide,
        style,
        { opacity: disabled ? 0.6 : 1 },
        hasTouchableFeedback && isHovered && styles.containerHovered,
        hasTouchableFeedback && pressed && styles.containerPressed,
      ]}
    >
      {icon && <RowIcon icon={icon} backgroundColor={backgroundColor} />}
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        {caption && <Text style={styles.caption}>{typeof caption === "string" ? caption : caption}</Text>}
      </View>
      {isLoading ? (
        <ActivityIndicator />
      ) : trailing ? (
        <View>{trailing}</View>
      ) : (
        !hideChevron && <MaterialIcons name="chevron-right" size={24} color="#c4c4c7" />
      )}
    </Pressable>
  );
};

const stylesheet = createStyleSheet((theme) => ({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: theme.ui.colors.card,
    borderBottomWidth: 0.5,
    borderColor: theme.ui.colors.border,
  },
  containerWide: {
    flexDirection: "column",
    padding: 20,
    borderWidth: 1,
    borderColor: theme.ui.colors.border,
    borderRadius: 10,
    alignItems: "flex-start",
  },
  containerHovered: {
    backgroundColor: theme.components.plainList.hover,
  },
  containerPressed: {
    backgroundColor: theme.components.plainList.pressed,
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 18,
    color: theme.textPresets.main,
  },
  caption: {
    fontSize: 14,
    color: theme.textPresets.subtitle,
  },
}));

export default Row;
