/*
 * Row.tsx - Created on Sun Jun 23 2024 by Luis Arturo Valdes Romero
 *
 * Copyright (c) 2024 Aura Residuos Sustentables
 */

import { View, Text, StyleSheet, Pressable } from "react-native";
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
}

// Properties when trailingType is "default"
interface DefaultProps extends BaseProps {
  trailingType: "chevron";
  caption?: string;
}

// Properties when trailingType is not "default"
interface NonDefaultProps extends BaseProps {
  trailingType:
    | "button"
    | "date-picker"
    | "date-time-picker"
    | "time-picker"
    | "pop-up"
    | "toggle";
  caption?: never; // Use `never` to indicate this property shouldn't be used
}

type ListItemProps = DefaultProps | NonDefaultProps;

const Row = ({ title, caption, icon, color, onPress }: ListItemProps) => {
  const { styles } = useStyles(stylesheet);

  return (
    <Pressable onPress={onPress}>
      <View style={styles.container}>
        <View style={styles.leadingContainer}>
          {icon && color && <RowIcon icon={icon} color={color} />}
          <Text style={styles.title}>{title}</Text>
        </View>
        <View style={styles.trailingContainer}>
          <Text style={styles.caption}>{caption}</Text>
          <MaterialIcons name="chevron-right" size={25} color="#c4c4c7" />
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
