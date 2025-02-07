import { ShieldAlert, ShieldX } from "lucide-react-native";
import { Platform, Text, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { FormButton } from "../Form/FormButton";
import React from "react";
import { Stack } from "expo-router";

type ErrorScreenType = {
  caption: string;
  buttonCaption: string;
  retryFunction: () => void;
  isInModal?: boolean;
};

export default function ErrorScreen({ caption, retryFunction, buttonCaption, isInModal = false }: ErrorScreenType) {
  const { styles } = useStyles(stylesheet);

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: undefined,
          title: "Error",
          headerSearchBarOptions: undefined,
        }}
      />
      <View style={styles.container(isInModal)}>
        <View style={styles.content}>
          <View style={styles.headingContainer}>
            <ShieldX color={styles.icon.color} size={50} />
            <Text style={styles.text}>{caption}</Text>
          </View>
          <FormButton title={buttonCaption} onPress={retryFunction} />
        </View>
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
  content: {
    gap: 25,
  },
  headingContainer: {
    alignItems: "center",
    gap: 6,
  },
  text: {
    fontSize: 20,
    color: theme.textPresets.main,
    textAlign: "center",
  },
  icon: {
    color: theme.textPresets.main,
  },
}));
