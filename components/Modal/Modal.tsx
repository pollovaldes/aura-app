import React, { useState, useEffect, ReactNode } from "react";
import {
  Modal as RNModal,
  ModalProps as RNModalProps,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Dimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { Easing, FadeIn, LinearTransition, ZoomIn } from "react-native-reanimated";
import { useAccentTheme } from "@/context/AccentThemeContext";
import { createStyleSheet, useStyles } from "react-native-unistyles";

type ModalProps = RNModalProps & {
  isOpen: boolean;
  close: () => void;
  children: ReactNode;
};

export default function Modal({ isOpen, close, children, ...rest }: ModalProps) {
  const { styles } = useStyles(stylesheet);
  const { accentColorHex } = useAccentTheme();
  const insets = useSafeAreaInsets();

  const [screenWidth, setScreenWidth] = useState(Dimensions.get("window").width);
  const [screenHeight, setScreenHeight] = useState(Dimensions.get("window").height);

  useEffect(() => {
    const updateWidth = () => setScreenWidth(Dimensions.get("window").width);
    const widthSubscription = Dimensions.addEventListener("change", updateWidth);

    const updateHeight = () => setScreenHeight(Dimensions.get("window").height);
    const heightSubscription = Dimensions.addEventListener("change", updateHeight);

    return () => {
      widthSubscription.remove();
      heightSubscription.remove();
    };
  }, []);

  if (!isOpen) return null;

  return (
    <RNModal visible={isOpen} transparent animationType="none" statusBarTranslucent {...rest}>
      <View style={styles.container(screenWidth, screenHeight)}>
        <Animated.View style={styles.overlay} entering={FadeIn.duration(300)} />
        <KeyboardAvoidingView style={styles.keyboardAvoider} behavior={Platform.OS === "ios" ? "padding" : "height"}>
          <ScrollView
            contentContainerStyle={styles.scrollContentContainer(insets.top)}
            keyboardShouldPersistTaps="handled"
          >
            <Animated.View
              style={styles.modalCard(screenWidth)}
              entering={ZoomIn.duration(300)}
              layout={LinearTransition.easing(Easing.out(Easing.ease)).duration(175)}
            >
              <TouchableOpacity onPress={close}>
                <Text style={styles.closeButton(accentColorHex)}>Cerrar</Text>
              </TouchableOpacity>
              {children}
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </RNModal>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  container: (width: number, height: number) => ({
    height: height,
    width: width,
  }),
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
  },
  keyboardAvoider: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  scrollContentContainer: (topInset: number) => ({
    flexGrow: 1,
    justifyContent: "center",
    paddingBottom: Platform.OS === "ios" ? topInset : 60,
    paddingTop: Platform.OS === "ios" ? topInset : 60,
  }),
  modalCard: (width: number) => ({
    maxWidth: 550,
    width: width - 24,
    alignSelf: "center",
    backgroundColor: theme.ui.colors.card,
    borderRadius: 10,
    padding: 12,
  }),
  closeButton: (accentColor: string) => ({
    color: accentColor,
    fontSize: 18,
    textAlign: "right",
    padding: 6,
  }),
}));
