import { ShieldAlert, ShieldX } from "lucide-react-native";
import { Text, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { FormButton } from "../Form/FormButton";
import React from "react";
import { Stack } from "expo-router";

type ErrorScreenType = {
  caption: string;
  buttonCaption: string;
  retryFunction: () => void;
};

export default function ErrorScreen({ caption, retryFunction, buttonCaption }: ErrorScreenType) {
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
      <View style={styles.container}>
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
  container: {
    height: "100%",
    justifyContent: "center",
    alignSelf: "center",
    width: "100%",
    maxWidth: 400,
    backgroundColor: theme.ui.colors.background,
    paddingHorizontal: 16,
  },
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
