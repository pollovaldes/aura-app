import { Link } from "expo-router";
import React from "react";
import { Pressable, Text } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

export default function TermsAndPrivacy() {
  const { styles } = useStyles(stylesheet);

  return (
    <Text style={styles.text}>
      Al registrarte o iniciar sesión con cualquier método de autenticación
      provisto, estás creando una cuenta de Aura y aceptas los{" "}
      <Link href="/terms" asChild>
        <Pressable>
          <Text style={styles.link}>Términos</Text>
        </Pressable>
      </Link>{" "}
      y la{" "}
      <Link href="/privacy-policy" asChild>
        <Pressable>
          <Text style={styles.link}>Política de Privacidad</Text>
        </Pressable>
      </Link>{" "}
      de Aura.
    </Text>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  text: {
    color: theme.colors.text.subtitle,
    textAlign: "center",
  },
  link: {
    color: "#0ea5e9", // Customize link color
    textDecorationLine: "underline",
    userSelect: "none",
  },
}));
