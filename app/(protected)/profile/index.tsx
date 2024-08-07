/*
 * index.tsx - Created on Mon Jun 24 2024 by Luis Arturo Valdes Romero
 *
 * Copyright (c) 2024 Aura Residuos Sustentables
 */

import { FormButton } from "@/components/Form/FormButton";
import { useSession, useUser } from "@/context/SessionContext";
import { supabase } from "@/lib/supabase";
import { Text, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

export default function Page() {
  const { styles } = useStyles(stylesheet);

  const session = useSession();
  async function signOut() {
    let { error } = await supabase.auth.signOut();
  }

  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <Text style={styles.title}>Stack de Perfil</Text>
        <FormButton title="Cerrar sesión" onPress={() => signOut()} />
        <Text style={styles.text}>{JSON.stringify(session?.user)}</Text>
      </View>
    </View>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  container: {
    marginTop: "15%",
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
    color: theme.ui.colors.text,
  },
  text: {
    color: theme.ui.colors.text,
  },
}));
