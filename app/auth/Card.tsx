import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import { createStyleSheet, mq, useStyles } from "react-native-unistyles";
import Form from "./Form";
import useKeyboardHeight from "@/hooks/useKeyboardHeight";

export default function Card() {
  const { styles } = useStyles(stylesheet);
  const height = useKeyboardHeight();

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
        keyboardDismissMode="on-drag"
      >
        <Form />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  container: {
    paddingHorizontal: 12,
    flex: 1,
  },
}));
