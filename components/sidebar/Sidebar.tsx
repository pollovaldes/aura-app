import { View, StyleSheet, Text, Image, Button, Pressable } from "react-native";
import React, { ReactNode } from "react";
import { createStyleSheet, useStyles } from "react-native-unistyles";

interface SidebarProps {
  children: ReactNode;
}

export default function Sidebar({ children }: SidebarProps) {
  const { styles } = useStyles(stylesheet);

  return (
    <View style={styles.container}>
      <View style={styles.navHeaderContainer}>
        <Text style={styles.header}>Navegación</Text>
      </View>
      {children}
    </View>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  container: {
    width: 230,
    backgroundColor: theme.ui.colors.card,
    borderRightWidth: 1,
    borderColor: theme.ui.colors.border,
    paddingHorizontal: 10,
    paddingTop: 15,
  },
  navHeaderContainer: {
    marginBottom: 10,
  },
  header: {
    color: theme.textPresets.main,
    fontSize: 20,
    fontWeight: "600",
  },
}));
