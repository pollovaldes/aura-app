import React, { ReactNode, useState } from "react";
import { View, Text, Pressable, ActivityIndicator, StyleProp, ViewStyle, Platform } from "react-native";
import RowIcon from "./RowIcon";
import { MaterialIcons } from "@expo/vector-icons";
import { LucideProps } from "lucide-react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import Animated, { Easing, LinearTransition } from "react-native-reanimated";

interface RowProps {
  title?: string | null;
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
  isInModal?: boolean;
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
  isInModal = false,
}: RowProps) => {
  const { styles, theme } = useStyles(stylesheet);
  const [isHovered, setIsHovered] = useState(false);

  if (!show) return;

  if (children) {
    return <View style={[styles.container(isInModal), style]}>{children}</View>;
  }

  return (
    <Pressable
      onPress={onPress}
      disabled={isLoading || disabled || !onPress}
      onHoverIn={() => hasTouchableFeedback && setIsHovered(true)}
      onHoverOut={() => hasTouchableFeedback && setIsHovered(false)}
      style={({ pressed }) => [
        styles.container(isInModal),
        style,
        { opacity: disabled ? 0.6 : 1 },
        hasTouchableFeedback && isHovered && styles.containerHovered,
        hasTouchableFeedback && pressed && styles.containerPressed,
      ]}
    >
      {icon && <RowIcon icon={icon} backgroundColor={backgroundColor} />}
      <View style={styles.textContainer}>
        <Text style={styles.title} selectable={false}>
          {title}
        </Text>
        {caption && (
          <Text style={styles.caption} selectable={false}>
            {typeof caption === "string" ? caption : caption}
          </Text>
        )}
      </View>
      {isLoading ? (
        <ActivityIndicator color={Platform.OS !== "ios" ? theme.ui.colors.primary : undefined} />
      ) : trailing ? (
        <View style={styles.trailingPadding}>{trailing}</View>
      ) : (
        !hideChevron && <MaterialIcons name="chevron-right" size={24} color="#c4c4c7" />
      )}
    </Pressable>
  );
};

const stylesheet = createStyleSheet((theme, runtime) => ({
  container: (isInModal: boolean) => ({
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: isInModal ? theme.components.groupedListInModal.backgroundColor : theme.ui.colors.card,
    borderBottomWidth: runtime.hairlineWidth,
    borderColor: theme.ui.colors.border,
  }),
  containerWide: {
    flexDirection: "column",
    padding: 20,
    borderWidth: runtime.hairlineWidth,
    borderColor: theme.ui.colors.border,
    borderRadius: 10,
    alignItems: "flex-start",
  },
  containerHovered: {
    backgroundColor: theme.ui.colors.border,
  },
  containerPressed: {
    backgroundColor: theme.ui.colors.background,
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
  trailingPadding: {
    paddingLeft: 12,
  },
}));

export default Row;
