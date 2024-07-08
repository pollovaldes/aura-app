/*
 * index.tsx - Created on Mon Jun 24 2024 by Luis Arturo Valdes Romero
 *
 * Copyright (c) 2024 Aura Residuos Sustentables
 */

import { Link } from "expo-router";
import { House } from "lucide-react-native";
import { View, StyleSheet, Text, Pressable } from "react-native";

export default function Page() {
  return (
    <View style={styles.container}>
      <Text>Hey</Text>
      <Link href="/trucks/documents" asChild>
        <Pressable>
          <House />
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
});
