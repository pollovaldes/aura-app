/*
 * RowIcon.tsx - Created on Sun Jun 23 2024 by Luis Arturo Valdes Romero
 *
 * Copyright (c) 2024 Aura Residuos Sustentables
 */

import { View, Text, StyleSheet } from "react-native";
import React, { ReactNode } from "react";
import { MaterialIcons } from "@expo/vector-icons";

interface RowIconProps {
  icon: ReactNode;
  backgroundColor: string;
}

const RowIcon = ({ icon, backgroundColor: color }: RowIconProps) => {
  return (
    <View style={[styles.container, { backgroundColor: color }]}>{icon}</View>
  );
};

export default RowIcon;

const styles = StyleSheet.create({
  container: {
    width: 32,
    height: 32,
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 17,
  },
});
