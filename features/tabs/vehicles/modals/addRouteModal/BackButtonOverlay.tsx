import React from "react";
import { TouchableOpacity, StyleSheet, View, Text } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { ChevronLeft } from "lucide-react-native";

interface BackButtonOverlayProps {
  back: () => void;
}

export function BackButtonOverlay({ back }: BackButtonOverlayProps) {
  const { styles } = useStyles(stylesheet);

  return (
    <TouchableOpacity style={styles.container} onPress={back}>
      <View style={styles.backButtonContainer}>
        <ChevronLeft size={styles.icon.size} color={styles.icon.color} />
        <Text style={styles.text}>Atrás</Text>
      </View>
    </TouchableOpacity>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  container: {
    position: "absolute",
    top: -42,
    left: 0,
    padding: 0,
    zIndex: 2,
  },
  backButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    color: theme.ui.colors.primary,
    size: 30,
  },
  text: {
    color: theme.ui.colors.primary,
    fontSize: 18,
  },
}));
