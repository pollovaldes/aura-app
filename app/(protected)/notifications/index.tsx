/*
 * index.tsx - Created on Mon Jun 24 2024 by Luis Arturo Valdes Romero
 *
 * Copyright (c) 2024 Aura Residuos Sustentables
 */

import { Pressable, StyleSheet, Text, View } from "react-native";
import useDatabaseOperations from "@/hooks/useDatabaseOperations";
import { useEffect } from "react";

export default function Page() {
  const { executeOperation, isLoading, error } = useDatabaseOperations();

  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <Text style={styles.title}>Stack de notificaciones</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 24,
  },
  main: {
    flex: 1,
    justifyContent: "center",
    maxWidth: 960,
    marginHorizontal: "auto",
  },
  title: {
    fontSize: 30,
  },
  subtitle: {
    fontSize: 36,
    color: "#38434D",
  },
});
