/*
 * index.tsx - Created on Mon Jun 24 2024 by Luis Arturo Valdes Romero
 *
 * Copyright (c) 2024 Aura Residuos Sustentables
 */

import { Text, View } from "react-native";
import React from "react";
import { Link, router } from "expo-router";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import AuraLogo from "@/components/web-logo-title/AuraLogo";
import AuthButton from "@/components/buttons/AuthButtons";

export default function Index() {
  const { styles } = useStyles(stylesheet);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <AuraLogo width={250} height={90} fill={styles.logo.color} />
      </View>
      <View style={styles.textsContainer}>
        <Text style={styles.header}>Bienvenido</Text>
        <Text style={styles.subtitle}>Elige un método para autenticarte</Text>
      </View>
      <View style={styles.authContainer}>
        <View style={{ flexDirection: "column" }}>
          <AuthButton
            title="Número telefónico"
            authProvider="phone"
            onPress={() => router.replace("/trucks")}
          />
          <AuthButton title="Continuar con Google" authProvider="google" />
          <AuthButton title="Continuar con Apple" authProvider="apple" />
          <AuthButton
            title="AUTH FLOW"
            authProvider="apple"
            onPress={() => router.replace("/auth-flow")}
          />
        </View>
      </View>
    </View>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  container: {
    padding: 15,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    //backgroundColor: "#c81e1e",
    margin: "auto",
    width: 360,
  },
  logoContainer: {
    marginBottom: 15,
  },
  textsContainer: {
    marginBottom: 50,
    width: "100%",
  },
  authContainer: {
    width: "100%",
  },
  header: {
    color: theme.colors.text.main,
    fontSize: 40,
    fontWeight: "700",
  },
  subtitle: {
    color: theme.colors.text.main,
    fontSize: 23,
    fontWeight: "300",
  },
  logo: {
    color: theme.colors.inverted,
  },
}));
