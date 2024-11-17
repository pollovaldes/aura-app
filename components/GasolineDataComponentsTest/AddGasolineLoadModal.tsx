// components/AddGasolineLoadModal.tsx
import React, { useState } from "react";
import { View, Text, Alert } from "react-native";
import Modal from "@/components/Modal/Modal";
import FormInput from "@/components/Form/FormInput";
import { FormButton } from "@/components/Form/FormButton";
import FormTitle from "@/app/auth/FormTitle";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { supabase } from "@/lib/supabase";

interface AddGasolineLoadModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicleId: string;
  profile: any;
  onSuccess: () => void;
}

export default function AddGasolineLoadModal({
  isOpen,
  onClose,
  vehicleId,
  profile,
  onSuccess,
}: AddGasolineLoadModalProps) {
  const { styles } = useStyles(stylesheet);
  const [formData, setFormData] = useState({
    amount: "",
    status: "pending",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const submitGasolineLoad = async () => {
    setIsLoading(true);
    const { error } = await supabase.from("gasoline_loads").insert({
      vehicle_id: vehicleId,
      user_id: profile?.id,
      amount: Number(formData.amount),
      status: profile?.role === "OWNER" ? "approved" : "pending",
      approved_by: profile?.role === "OWNER" ? profile.id : null,
      approved_at: profile?.role === "OWNER" ? new Date() : null,
    });

    if (error) {
      Alert.alert("Error", error.message);
    } else {
      Alert.alert("Éxito", "Carga de gasolina agregada exitosamente.");
      onClose();
      setFormData({ amount: "", status: "pending" });
      onSuccess();
    }
    setIsLoading(false);
  };

  return (
    <Modal isOpen={isOpen}>
      <View style={styles.modalContainer}>
        <Text style={styles.closeButton} onPress={onClose}>
          Cerrar
        </Text>
        <View style={styles.section}>
          <View style={styles.group}>
            <FormTitle title="Agregar Carga de Gasolina" />
            <Text style={styles.subtitle}>
              Escribe cuánto dinero cargaste de gasolina en MXN.
            </Text>
          </View>
          <View style={styles.group}>
            <FormInput
              placeholder="Monto"
              value={formData.amount}
              onChangeText={(value) => handleChange("amount", value)}
              description=""
              keyboardType="numeric"
            />
            <FormButton
              title="Enviar"
              onPress={submitGasolineLoad}
              isLoading={isLoading}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  modalContainer: {
    padding: 20,
    backgroundColor: theme.ui.colors.card,
    borderRadius: 10,
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
  subtitle: {
    color: theme.textPresets.main,
    textAlign: "center",
  },
}));