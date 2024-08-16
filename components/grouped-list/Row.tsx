import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from "react-native";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import RowIcon from "./RowIcon";
import { createStyleSheet, useStyles } from "react-native-unistyles";

// Base properties common to all types
interface BaseProps {
  title: string;
  icon?: keyof typeof MaterialIcons.glyphMap;
  color?: string;
  onPress?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
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
  color,
  onPress,
  disabled = false,
  isLoading,
}: DefaultProps) => {
  const { styles } = useStyles(stylesheet);

  return (
    <Pressable
      disabled={isLoading || disabled}
      onPress={onPress}
      style={({ pressed }) => [
        { opacity: disabled ? 0.45 : 1 },
        pressed && { opacity: 0.45 },
      ]}
    >
      <View style={styles.container}>
        <View style={styles.leadingContainer}>
          {icon && color && <RowIcon icon={icon} color={color} />}
          <Text style={styles.title}>{title}</Text>
        </View>
        <View style={styles.trailingContainer}>
          {isLoading ? (
            <ActivityIndicator />
          ) : (
            <>
              <Text style={styles.caption}>{caption}</Text>
              <MaterialIcons name="chevron-right" size={25} color="#c4c4c7" />
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
    height: 44,
    marginHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
    fontSize: 16.5,
    color: theme.textPresets.main,
  },
  caption: {
    fontSize: 16.5,
    color: theme.textPresets.main,
  },
}));
