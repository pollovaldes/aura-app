import { View, Text, Pressable, ActivityIndicator } from "react-native";
import React, { ReactNode } from "react";
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
}

// Properties when trailingType is "default"
interface DefaultProps extends BaseProps {
  trailingType: "chevron";
  caption?: string;
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
}: DefaultProps) => {
  const { styles } = useStyles(stylesheet);

  return (
    <Pressable
      disabled={isLoading || disabled}
      onPress={onPress}
      style={({ pressed }) => [
        { opacity: disabled ? 0.75 : 1 },
        pressed && { opacity: 0.45 },
      ]}
    >
      <View style={styles.container}>
        {children && <View style={styles.childrenContainer}>{children}</View>}
        <View style={styles.leadingContainer}>
          {icon && color && <RowIcon icon={icon} backgroundColor={color} />}
          <Text style={styles.title}>{title}</Text>
        </View>
        <View style={styles.trailingContainer}>
          {isLoading ? (
            <ActivityIndicator />
          ) : (
            <>
              <Text style={styles.caption}>{caption}</Text>
              {showChevron ? (
                <MaterialIcons name="chevron-right" size={25} color="#c4c4c7" />
              ) : null}
            </>
          )}
        </View>
      </View>
    </Pressable>
  );
};

export default Row;

const stylesheet = createStyleSheet((theme) => ({
  container: {
    minHeight: 50,
    marginHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  childrenContainer: {
    width: "80%",
    marginVertical: 12,
    height: 80,
  },
  trailingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  leadingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 17.5,
    color: theme.textPresets.main,
  },
  caption: {
    fontSize: 16.5,
    color: theme.textPresets.subtitle,
  },
}));
