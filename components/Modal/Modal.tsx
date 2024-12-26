import { useAccentTheme } from "@/context/AccentThemeContext";
import {
  KeyboardAvoidingView,
  Platform,
  Modal as RNModal,
  ModalProps as RNModalProps,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { ReactNode } from "react";

type ModalProps = RNModalProps & {
  isOpen: boolean;
  close: () => void;
  children: ReactNode;
};

export default function Modal({ isOpen, close, children, ...rest }: ModalProps) {
  const { styles } = useStyles(stylesheet);
  const { accentColorHex } = useAccentTheme();

  return (
    <RNModal visible={isOpen} transparent animationType="slide" {...rest} statusBarTranslucent>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "height" : "padding"} style={styles.container}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            paddingTop: 80,
            paddingBottom: 80,
          }}
        >
          <View style={styles.modalContainer}>
            <TouchableOpacity onPress={close}>
              <Text style={styles.closeButton(accentColorHex)}>Cerrar</Text>
            </TouchableOpacity>
            {children}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </RNModal>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  container: {
    flex: 1,
    paddingHorizontal: 6,
    backgroundColor: "rgba(0.0, 0.0, 0.0, 0.65)",
  },
  modalContainer: {
    width: "100%",
    alignSelf: "center",
    maxWidth: 500,
    backgroundColor: theme.ui.colors.card,
    borderRadius: 10,
    padding: 24,
  },
  closeButton: (accentColor: string) => ({
    color: accentColor,
    fontSize: 18,
    textAlign: "right",
    padding: 6,
  }),
}));
