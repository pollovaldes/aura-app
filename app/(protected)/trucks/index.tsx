/*
 * index.tsx - Created on Mon Jun 24 2024 by Luis Arturo Valdes Romero
 *
 * Copyright (c) 2024 Aura Residuos Sustentables
 */

import { Link } from "expo-router";
import { House, Truck } from "lucide-react-native";
import { View, StyleSheet, Text, Pressable, ActivityIndicator } from "react-native";
import { supabase } from "@/lib/supabase";
import { useEffect } from "react";
import TruckList from "@/components/trucks/TrucksList";


export default function Page() {

  return (
    <View style={styles.container}>
      <TruckList />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: "50%",
    justifyContent: "flex-start",
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
});
