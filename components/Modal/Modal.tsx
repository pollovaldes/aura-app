import {
  KeyboardAvoidingView,
  Platform,
  Modal as RNModal,
  ModalProps as RNModalProps,
  ScrollView,
} from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

type ModalProps = RNModalProps & {
  isOpen: boolean;
};

export default function Modal({ isOpen, children, ...rest }: ModalProps) {
  const { styles } = useStyles(stylesheet);

  return (
    <RNModal
      visible={isOpen}
      transparent
      animationType="slide"
      statusBarTranslucent
      {...rest}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            paddingTop: 80,
            paddingBottom: 80,
          }}
        >
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </RNModal>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  container: {
    flex: 1,
    paddingHorizontal: 12,
    backgroundColor: "rgba(0.0, 0.0, 0.0, 0.65)",
  },
}));
