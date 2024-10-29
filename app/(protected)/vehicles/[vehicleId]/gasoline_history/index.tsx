import React, { useState } from "react";
import { View, Text, Pressable, Alert } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { supabase } from "@/lib/supabase";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { GasolineLoad } from "@/types/GasolineLoad";
import FormInput from "@/components/Form/FormInput";
import { FormButton } from "@/components/Form/FormButton";
import Modal from "@/components/Modal/Modal";
import LoadingScreen from "@/components/dataStates/LoadingScreen";
import ErrorScreen from "@/components/dataStates/ErrorScreen";
import FormTitle from "@/app/auth/FormTitle";
import useProfile from "@/hooks/useProfile";
import useVehicle from "@/hooks/truckHooks/useVehicle";
import UnauthorizedScreen from "@/components/dataStates/UnauthorizedScreen";
import useGasolineLoads from "@/hooks/useGasolineLoads";

export default function GasolineHistory() {
  const { styles } = useStyles(stylesheet);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    status: "pending",
  });
  const [isLoading, setIsLoading] = useState(false);

  const { profile, isProfileLoading, fetchProfile } = useProfile();
  const { vehicles, vehiclesAreLoading, fetchVehicles } = useVehicle();
  const { vehicleId } = useLocalSearchParams<{ vehicleId: string }>();

  useGasolineLoads();

  if (vehiclesAreLoading) {
    return (
      <>
        <LoadingScreen caption="Cargando vehículos" />
        <Stack.Screen
          options={{ title: "Cargando...", headerLargeTitle: false }}
        />
      </>
    );
  }

  if (isProfileLoading) {
    return (
      <>
        <Stack.Screen options={{ title: "Cargando..." }} />
        <LoadingScreen caption="Cargando perfil y permisos" />
      </>
    );
  }

  if (!profile) {
    return (
      <>
        <Stack.Screen options={{ title: "Error", headerLargeTitle: false }} />
        <ErrorScreen
          caption="Ocurrió un error al cargar tu perfil"
          buttonCaption="Reintentar"
          retryFunction={fetchProfile}
        />
      </>
    );
  }

  if (!vehicles) {
    return (
      <>
        <Stack.Screen options={{ title: "Error", headerLargeTitle: false }} />
        <ErrorScreen
          caption="Ocurrió un error al cargar los vehículos"
          buttonCaption="Reintentar"
          retryFunction={fetchVehicles}
        />
      </>
    );
  }

  const vehicle = vehicles.find((Vehicle) => Vehicle.id === vehicleId);

  if (!vehicle) {
    return (
      <>
        <Stack.Screen options={{ title: "Recurso inaccesible" }} />
        <UnauthorizedScreen
          caption="No tienes acceso a este recurso."
          buttonCaption="Reintentar"
          retryFunction={fetchVehicles}
        />
      </>
    );
  }

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const submitGasolineLoad = async () => {
    setIsLoading(true);
    const { data, error } = await supabase.from("gasoline_loads").insert({
      vehicle_id: vehicle.id,
      user_id: profile.id,
      amount: Number(formData.amount),
      status: profile.role === "OWNER" ? "approved" : "pending",
      approved_by: profile.role === "OWNER" ? profile.id : null,
      approved_at: profile.role === "OWNER" ? new Date() : null,
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
          <Text
            style={styles.closeButton}
            onPress={() => setIsModalOpen(false)}
          >
            Cerrar
          </Text>
          <View style={styles.section}>
            <View style={styles.group}>
              <FormTitle title="Add Gasoline Load" />
              <Text style={styles.subtitle}>
                Escribe cuanto dinero cargaste de gasolina en MXN.
              </Text>
            </View>
            <View style={styles.group}>
              <FormInput
                placeholder="Monto"
                value={formData.amount}
                onChangeText={(value) => handleChange("amount", value)}
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
    color: theme.headerButtons.color,
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
