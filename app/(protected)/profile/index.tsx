/*
 * index.tsx - Created on Mon Jun 24 2024 by Luis Arturo Valdes Romero
 *
 * Copyright (c) 2024 Aura Residuos Sustentables
 */

import { FormButton } from "@/components/Form/FormButton";
import { supabase } from "@/lib/supabase";
import { StyleSheet, Text, View } from "react-native";

export default function Page() {
  async function signOut() {
    let { error } = await supabase.auth.signOut();
  }

  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <Text style={styles.title}>Stack de Perfil</Text>
        <FormButton title="Cerrar sesión" onPress={() => signOut()} />
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
