import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { Form } from "./Form";
import { SignInModalType } from "./SignInModalType";
import Modal from "@/components/Modal/Modal";
import { CreateAccountModal } from "./CreateAccountModal";

export function SignIn() {
  const { styles } = useStyles(stylesheet);
  const [activeModal, setActiveModal] = useState<SignInModalType>(null);
  const closeModal = () => setActiveModal(null);

  return (
    <>
      <Modal isOpen={activeModal === "create_account"} close={closeModal}>
        <CreateAccountModal />
      </Modal>
      <View style={styles.contentView}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingView}
        >
          <ScrollView contentContainerStyle={styles.scrollViewContentContainer} showsVerticalScrollIndicator={false}>
            <Form setActiveModal={setActiveModal} />
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  contentView: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
    margin: "auto",
    paddingHorizontal: 12,
  },
  scrollViewContentContainer: {
    flexGrow: 1,
    maxWidth: 550,
    justifyContent: "center",
    paddingVertical: 160,
  },
}));
