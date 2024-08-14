import { ReactNode } from "react";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { createStyleSheet, useStyles } from "react-native-unistyles";

interface AuthCardProps {
  children: ReactNode;
}

export default function AuthCard({ children }: AuthCardProps) {
  const { styles } = useStyles(stylesheet);
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
        {children}
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
