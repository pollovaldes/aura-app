/*
 * RowIcon.tsx - Created on Sun Jun 23 2024 by Luis Arturo Valdes Romero
 *
 * Copyright (c) 2024 Aura Residuos Sustentables
 */

import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";

interface RowIconProps {
  icon: keyof typeof MaterialIcons.glyphMap;
  color: string;
}

const RowIcon = ({ icon, color }: RowIconProps) => {
  return (
    <View style={[styles.container, { backgroundColor: color }]}>
      <MaterialIcons name={icon} color="#ffffff" size={22} />
    </View>
  );
};

export default RowIcon;

const styles = StyleSheet.create({
  container: {
    width: 28,
    height: 28,
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 17,
  },
});
