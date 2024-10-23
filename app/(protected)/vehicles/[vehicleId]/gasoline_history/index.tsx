// index.tsx
import React, { useState } from "react";
import { View, Text, Pressable, Alert } from "react-native";
import { Stack } from "expo-router";
import { supabase } from "@/lib/supabase";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { GasolineLoad } from "@/types/GasolineLoad";
import FormInput from "@/components/Form/FormInput";
import { FormButton } from "@/components/Form/FormButton";
import Modal from "@/components/Modal/Modal";
import LoadingScreen from "@/components/dataStates/LoadingScreen";
import ErrorScreen from "@/components/dataStates/ErrorScreen";
import FormTitle from "@/app/auth/FormTitle";

export default function GasolineHistory() {
  const { styles } = useStyles(stylesheet);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const submitGasolineLoad = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("gasoline_loads")
      .insert({
        amount: Number(formData.amount),
      });

    if (error) {
      Alert.alert("Error", error.message);
    } else {
      Alert.alert("Success", "Gasoline load added successfully.");
      setIsModalOpen(false);
      // Refresh data if needed
    }
    setIsLoading(false);
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Gasoline History",
          headerRight: () => (
            <Pressable onPress={() => setIsModalOpen(true)}>
              <Text style={styles.addButton}>Add</Text>
            </Pressable>
          ),
        }}
      />
      <Modal isOpen={isModalOpen}>
        <View style={styles.modalContainer}>
          <Text style={styles.closeButton} onPress={() => setIsModalOpen(false)}>
            Cerrar
          </Text>
          <View style={styles.section}>
            <View style={styles.group}>
              <FormTitle title="Add Gasoline Load" />
              <Text style={styles.subtitle}>
                Escribe cuato dinero cargaste de gasolina en MXN.
              </Text>
            </View>
            <View style={styles.group}>
              <FormInput
                placeholder="Monto"
                value={formData.amount}
                onChangeText={(value) => handleChange("vehicle_id", value)}
                description=""
              />
              <FormButton
                title="Submit"
                onPress={submitGasolineLoad}
                isLoading={isLoading}
              />
            </View>
          </View>
        </View>
      </Modal>
      {/* Add your table component here */}
    </>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  addButton: {
    color: theme.ui.colors.primary,
    fontSize: 16,
  },
  modalContainer: {
    padding: 20,
    backgroundColor: theme.ui.colors.card,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
    color: theme.textPresets.main,
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
  subtitle: {
    color: theme.textPresets.main,
    textAlign: "center",
  },
}));