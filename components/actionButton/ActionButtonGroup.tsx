import React from "react";
import { Platform, useWindowDimensions, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

export function ActionButtonGroup({ children }: { children: React.ReactNode }) {
  const { styles } = useStyles(stylesheet);
  const { width } = useWindowDimensions();
  return <View style={styles.container}>{children}</View>;
}

const stylesheet = createStyleSheet(() => ({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
    gap: 12,
    marginRight: Platform.select({
      ios: 0,
      android: 0,
      web: 12,
    }),
  },
}));
