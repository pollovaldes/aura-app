/*
 * index.tsx - Created on Sat Jun 29 2024 by Luis Arturo Valdes Romero
 *
 * Copyright (c) 2024 Aura Residuos Sustentables
 */

import { View, Text, StyleSheet } from "react-native";
import React from "react";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text>Vista de documentos anidada</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
