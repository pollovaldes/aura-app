import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  Platform,
} from "react-native";
import React, { ReactNode, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import RowIcon from "./RowIcon";
import { createStyleSheet, useStyles } from "react-native-unistyles";

// Base properties common to all types
interface BaseProps {
  title: string;
  icon?: ReactNode;
  color?: string;
  onPress?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  showChevron?: boolean;
  children?: ReactNode;
  pressedStyle?: boolean;
}

// Properties when trailingType is "default"
interface DefaultProps extends BaseProps {
  trailingType: "chevron";
  caption?: string | React.JSX.Element | (() => React.JSX.Element);
}

const Row = ({
  title,
  caption,
  icon,
  color = "white",
  onPress,
  disabled = false,
  isLoading,
  showChevron = true,
  children,
  pressedStyle = true,
}: DefaultProps) => {
  const { styles } = useStyles(stylesheet);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Pressable
      onHoverIn={() => !isLoading && !disabled && setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      disabled={isLoading || disabled}
      onPress={onPress}
      style={({ pressed }) => [
        { opacity: disabled ? 0.75 : 1 },
        pressedStyle && pressed && { opacity: 0.45 },
        isHovered && styles.containerHovered,
        styles.container,
      ]}
    >
      {children && <View style={{ width: "100%" }}>{children}</View>}

      <View style={[styles.leadingContainer, { flex: caption ? 1 : 10 }]}>
        <View>
          {icon && color && <RowIcon icon={icon} backgroundColor={color} />}
        </View>
        <Text style={styles.title}>{title}</Text>
      </View>

      <View style={styles.trailingContainer}>
        {isLoading ? (
          <ActivityIndicator />
        ) : typeof caption === "function" ? (
          caption()
        ) : (
          <>
            <Text style={styles.caption}>{caption}</Text>
            {showChevron && (
              <MaterialIcons name="chevron-right" size={25} color="#c4c4c7" />
            )}
          </>
        )}
      </View>
    </Pressable>
  );
};

export default Row;

const stylesheet = createStyleSheet((theme) => ({
  container: {
    padding: 12,
    gap: 12,
    flexDirection: "row",
  },
  containerHovered: {
    backgroundColor: theme.components.navBarListItem.hoveredBG,
  },
  trailingContainer: {
    flex: 1.2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 12,
  },
  leadingContainer: {
    flex: 1,
    alignItems: "center",
    flexDirection: "row",
  },
  title: {
    flexShrink: 1,
    textAlign: "left",
    fontSize: 17.5,
    color: theme.textPresets.main,
    ...Platform.select({
      web: {
        fontSize: 15.5,
      },
    }),
  },
  caption: {
    flexShrink: 1,
    textAlign: "right",
    fontSize: 16.5,
    color: theme.textPresets.subtitle,
    ...Platform.select({
      web: {
        fontSize: 15.5,
      },
    }),
  },
}));
