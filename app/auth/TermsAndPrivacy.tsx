import { router } from "expo-router";
import { openBrowserAsync } from "expo-web-browser";
import React from "react";
import { Text } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

export default function TermsAndPrivacy() {
  const { styles } = useStyles(stylesheet);

  return (
    <Text style={styles.text}>
      <Text>
        Al registrarte o iniciar sesión con cualquier método de autenticación
        provisto, estás creando una cuenta de Aura y aceptas los{" "}
      </Text>
      <Text
        style={styles.link}
        onPress={() => openBrowserAsync("http://localhost:8081/terms")}
      >
        Términos
      </Text>
      <Text> y la</Text>
      <Text style={styles.link} onPress={() => router.push("/privacy-policy")}>
        {" "}
        Política de Privacidad
      </Text>
      <Text> de Aura.</Text>
    </Text>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  text: {
    color: theme.textPresets.subtitle,
    textAlign: "center",
  },
  link: {
    color: theme.textPresets.link,
    textDecorationLine: "underline",
    userSelect: "none",
  },
}));
