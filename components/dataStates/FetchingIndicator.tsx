import { Stack } from "expo-router";
import React from "react";
import { ActivityIndicator, Platform, Text, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

type LoadingScreenType = {
  caption: string;
  isInModal?: boolean;
};

export function FetchingIndicator({ caption, isInModal = false }: LoadingScreenType) {
  const { styles, theme } = useStyles(stylesheet);

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: undefined,
          title: "",
          headerLargeTitle: false,
          headerSearchBarOptions: undefined,
        }}
      />
      <View style={styles.container(isInModal)}>
        <ActivityIndicator color={Platform.OS !== "ios" ? theme.ui.colors.primary : undefined} />
        <Text style={styles.text}>{caption}</Text>
      </View>
    </>
  );
}

const stylesheet = createStyleSheet((theme, runtime) => ({
  container: (isInModal: boolean) => ({
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
    backgroundColor: isInModal ? undefined : theme.ui.colors.background,
    gap: 8,
    paddingTop: isInModal ? 0 : Platform.OS === "ios" ? runtime.insets.top : 0,
  }),
  text: {
    fontSize: 16,
    color: theme.textPresets.subtitle,
    textAlign: "center",
  },
}));
