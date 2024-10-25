import { useState } from "react";
import Modal from "./Modal";
import { View, Text, TextInput, Alert } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { supabase } from "@/lib/supabase";
import FormTitle from "@/app/auth/FormTitle";
import { FormButton } from "../Form/FormButton";

type ModalProps = {
  isOpen: boolean;
  currentDataType: string;
  currentData: any;
  closeModal: () => void;
  dataChange: any;
  id: string;
  table?: string;
  identifier?: string;
};

export default function ChangeDataModal({
  isOpen,
  currentDataType,
  currentData,
  closeModal,
  dataChange,
  id,
  table = "camiones",
  identifier = "id",
}: ModalProps) {
  const { styles } = useStyles(stylesheet);
  const [loading, setLoading] = useState(false);
  const [newData, setNewData] = useState<any>();

  const checkUserProfile = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from(table)
      .update({
        [dataChange]: newData,
      })
      .eq(identifier, id)
      .single();
    if (error) {
      Alert.alert("Error", error.message);
      setLoading(false);
      return;
    }
    Alert.alert("Éxito", "Perfil actualizado");
    setLoading(false);
    closeModal();
  };

  return (
    <Modal isOpen={isOpen}>
      <View style={styles.modalContainer}>
        <Text style={styles.closeButton} onPress={closeModal}>
          Cerrar
        </Text>
        <View style={styles.section}>
          <View style={styles.group}>
            <FormTitle title={`Cambiar ${currentDataType}`} />
            <Text style={styles.subtitle}>
              El valor actual es: {currentData}
            </Text>
          </View>
          <View style={styles.group}>
            <TextInput
              placeholder={`Nuevo ${currentDataType}`}
              inputMode="text"
              style={styles.textInput}
              placeholderTextColor={styles.textInput.placehoolderTextColor}
              autoCorrect={false}
              onChangeText={setNewData}
            />
            <FormButton title="Continuar" onPress={checkUserProfile} />
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
    color: theme.headerButtons.color,
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
