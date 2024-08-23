import { useState } from "react";
import Modal from "./Modal";
import { View, Text, TextInput } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { supabase } from "@/lib/supabase";
import FormTitle from "@/app/auth/FormTitle";
import { FormButton } from "../Form/FormButton";

type ModalProps = {
  isOpen: boolean;
  currentData: any;
};

export default function ChangeDataModal({ isOpen, currentData } : ModalProps) {

  const [modal, setModal] = useState(false);
  const { styles } = useStyles(stylesheet);

  return (
    <Modal isOpen={isOpen}>
      <View style={styles.modalContainer}>
        <Text style={styles.closeButton} onPress={() => setModal(false)}>
          Cerrar
        </Text>
        {/* Form goes here */}
        <View style={styles.section}>
          <View style={styles.group}>
            <FormTitle title="Finaliza tu registro" />
            <Text style={styles.subtitle}>
              Para poder continuar debes terminar de llenar tus datos personales.
            </Text>
          </View>
          <View style={styles.group}>
            <TextInput
              placeholder="Nombre"
              inputMode="text"
              style={styles.textInput}
              placeholderTextColor={styles.textInput.placehoolderTextColor}
              autoCorrect={false}
              onChangeText={() => {}}
            />
            <FormButton
              title="Continuar"
              onPress={() => {}}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  modalContainer: {
    backgroundColor: theme.ui.colors.card,
    borderRadius: 10,
    padding: 24,
  },
  closeButton: {
    color: theme.ui.colors.primary,
    fontSize: 18,
    textAlign: "right",
  },
  section: {
    gap: theme.marginsComponents.section,
    alignItems: "center",
  },
  group: {
    gap: theme.marginsComponents.group,
    width: "100%",
  },
  logo: {
    color: theme.colors.inverted,
    width: 180,
    height: 60,
  },
  subtitle: {
    color: theme.textPresets.main,
    textAlign: "center",
  },
  textInput: {
    height: 45,
    borderRadius: 5,
    paddingHorizontal: 12,
    fontSize: 18,
    color: theme.textPresets.main,
    placehoolderTextColor: theme.textPresets.subtitle,
    backgroundColor: theme.textInput.backgroundColor,
  },
}));