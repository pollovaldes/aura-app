import { router, Stack } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { Platform, Pressable, Text } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

export default function Layout() {
  const { styles } = useStyles(stylesheet);

  return (
    <Stack
      screenOptions={{
        title: "Términos y condiciones",
        headerRight: () =>
          router.canGoBack() && (
            <Pressable onPress={() => router.back()} style={styles.container}>
              <Text style={styles.text}>Aceptar</Text>
            </Pressable>
          ),
      }}
    />
  );
}

const stylesheet = createStyleSheet((theme) => ({
  container: {
    marginRight: Platform.OS === "web" ? 16 : 0,
  },
  text: {
    fontSize: 18,
    color: theme.ui.colors.primary,
  },
}));
