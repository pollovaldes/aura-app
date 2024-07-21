import { Link, router } from "expo-router";
import React from "react";
import { Pressable, Text } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

export default function TermsAndPrivacy() {
  const { styles } = useStyles(stylesheet);

  return (
    <Text style={styles.text}>
      <Text>
        Al registrarte o iniciar sesión con cualquier método de autenticación
        provisto, estás creando una cuenta de Aura y aceptas los{" "}
      </Text>
      <Text style={styles.link} onPress={() => router.navigate("/terms")}>
        Términos
      </Text>
      <Text> y la</Text>
      <Text
        style={styles.link}
        onPress={() => router.navigate("/privacy-policy")}
      >
        {" "}
        Política de Privacidad
      </Text>
      <Text> de Aura.</Text>
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
