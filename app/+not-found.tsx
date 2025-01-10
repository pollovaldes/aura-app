import React, { useEffect } from "react";
import { View } from "react-native";
import { router, usePathname } from "expo-router";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import EmptyScreen from "@/components/dataStates/EmptyScreen";
import Toast from "react-native-toast-message";

const showToast = (title: string, caption: string) => {
  Toast.show({
    type: "alert",
    text1: title,
    text2: caption,
  });
};

const sanitizePath = (path: string): string => {
  const segments = path.split("/").filter(Boolean);
  const sanitizedSegments: string[] = [];

  segments.forEach((segment) => {
    const lastSegment = sanitizedSegments[sanitizedSegments.length - 1];
    if (segment !== lastSegment) {
      sanitizedSegments.push(segment);
    }
  });

  return "/" + sanitizedSegments.join("/");
};

export default function NotFoundScreen() {
  const { styles } = useStyles(stylesheet);
  const path = usePathname();

  useEffect(() => {
    const fixedPath = sanitizePath(path);
    if (fixedPath !== path) {
      showToast("Error de navegación", "Te redirigimos a la página de inicio");
      router.replace("/");
    }
  }, [path]);

  return (
    <View style={styles.container}>
      <EmptyScreen
        caption="Parece que la página que buscas no existe, intenta regresar al inicio"
        buttonCaption="Volver a inicio"
        retryFunction={() => router.replace("/")}
      />
    </View>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  container: {
    backgroundColor: theme.ui.colors.background,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
}));
