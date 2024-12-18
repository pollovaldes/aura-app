import React from "react";
import { View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

export function ActionButtonGroup({ children }: { children: React.ReactNode }) {
  const { styles } = useStyles(stylesheet);
  return <View style={styles.container}>{children}</View>;
}

const stylesheet = createStyleSheet(() => ({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
}));
