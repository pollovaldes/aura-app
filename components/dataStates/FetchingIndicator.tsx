import { Stack } from "expo-router";
import React from "react";
import { ActivityIndicator, Platform, Text, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { UnistylesRuntime } from "react-native-unistyles";

type LoadingScreenType = {
  caption: string;
};

export function FetchingIndicator({ caption }: LoadingScreenType) {
  const { styles, theme } = useStyles(stylesheet);

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: undefined,
          title: "",
          headerLargeTitle: false,
        }}
      />
      <View style={[styles.container, { paddingTop: Platform.OS === "ios" ? UnistylesRuntime.insets.top : 0 }]}>
        <ActivityIndicator color={Platform.OS === "web" ? theme.ui.colors.primary : undefined} />
        <Text style={styles.text}>{caption}</Text>
      </View>
    </>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
    backgroundColor: theme.ui.colors.background,
    gap: 8,
  },
  text: {
    fontSize: 16,
    color: theme.textPresets.subtitle,
    textAlign: "center",
  },
}));
