import React, { ReactNode } from "react";
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

interface ScrollableFormContainerProps {
  children: ReactNode;
}

export default function ScrollableFormContainer({ children }: ScrollableFormContainerProps) {
  const { styles } = useStyles(stylesheet);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={120}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        contentInsetAdjustmentBehavior="automatic"
        keyboardDismissMode="none"
      >
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  container: {
    flexGrow: 1,
    paddingHorizontal: 12,
    paddingVertical: 24,
    maxWidth: 530,
    margin: "auto",
    width: "100%",
  },
}));
