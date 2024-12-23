import { ShieldAlert } from "lucide-react-native";
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
        }}
      />
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.headingContainer}>
            <ShieldAlert color={styles.icon.color} size={35} />
            <Text style={styles.text}>{caption}</Text>
          </View>
          <FormButton title={buttonCaption} onPress={retryFunction} />
        </View>
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
    margin: 50,
  },
  content: {
    gap: 20,
  },
  headingContainer: {
    alignItems: "center",
    gap: 6,
  },
  text: {
    fontSize: 18,
    color: theme.textPresets.main,
    textAlign: "center",
  },
  icon: {
    color: theme.textPresets.main,
  },
}));
