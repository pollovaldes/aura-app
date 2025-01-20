import { hapticFeedback } from "@/features/global/functions/hapticFeedback";
import React, { ReactNode } from "react";
import {
  Modal as RNModal,
  ModalProps as RNModalProps,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
} from "react-native";
import Animated, { Easing, FadeIn, LinearTransition, ZoomIn } from "react-native-reanimated";
import { createStyleSheet, useStyles } from "react-native-unistyles";

type ModalProps = RNModalProps & {
  isOpen: boolean;
  close: () => void;
  children: ReactNode;
};

export default function Modal({ isOpen, close, children, ...rest }: ModalProps) {
  const { styles } = useStyles(stylesheet);

  if (!isOpen) return null;

  return (
    <RNModal visible={isOpen} transparent animationType="none" statusBarTranslucent {...rest}>
      <View style={styles.container}>
        <Animated.View style={styles.overlay} entering={FadeIn.duration(100)} />
        <KeyboardAvoidingView style={styles.keyboardAvoider} behavior={Platform.OS === "ios" ? "padding" : "height"}>
          <ScrollView
            contentContainerStyle={styles.scrollContentContainer}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Animated.View
              style={styles.modalCard}
              entering={ZoomIn.duration(250)}
              layout={LinearTransition.stiffness(100)}
            >
              <Text
                style={styles.closeButton}
                onPress={async () => {
                  await hapticFeedback();
                  close();
                }}
              >
                Cerrar
              </Text>

              {children}
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </RNModal>
  );
}

const stylesheet = createStyleSheet((theme, runtime) => ({
  container: {
    height: runtime.screen.height,
    width: runtime.screen.width,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
  },
  keyboardAvoider: {
    flex: 1,
    justifyContent: "center",
  },
  scrollContentContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingBottom: Platform.OS === "ios" ? runtime.insets.top : 60,
    paddingTop: Platform.OS === "ios" ? runtime.insets.top : 60,
  },
  modalCard: {
    maxWidth: 550,
    width: runtime.screen.width - 12,
    alignSelf: "center",
    backgroundColor: theme.ui.colors.card,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 16,
    flexDirection: "column",
    gap: 20,
  },
  closeButton: {
    color: theme.ui.colors.primary,
    fontSize: 18,
    textAlign: "right",
  },
}));
