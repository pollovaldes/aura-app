import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import Form from "./Form";
import useKeyboardHeight from "@/hooks/useKeyboardHeight";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Card() {
  const { styles } = useStyles(stylesheet);
  const height = useKeyboardHeight();
  const insets = useSafeAreaInsets();

  return (
    <KeyboardAvoidingView
      style={{
        marginTop: insets.top,
        marginBottom: insets.bottom,
        alignItems: "center",
        flex: 1,
      }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Form />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  contentContainer: {
    flexGrow: 1,
    justifyContent: "center",
    maxWidth: 500,
    marginHorizontal: 12,
  },
}));
