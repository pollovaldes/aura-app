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
    backgroundColor: theme.colors.backgroundSecondary,
    borderRightWidth: 1,
    borderColor: theme.colors.outline,
    paddingHorizontal: 10,
    paddingTop: 15,
  },
  navHeaderContainer: {
    marginBottom: 10,
  },
  header: {
    color: theme.colors.text.main,
    fontSize: 20,
    fontWeight: "600",
  },
}));
