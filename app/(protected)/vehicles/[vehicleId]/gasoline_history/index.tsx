import React, { useState, useEffect } from "react";
import { View, Text, Pressable, Alert, ScrollView } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { supabase } from "@/lib/supabase";
import { createStyleSheet, useStyles } from "react-native-unistyles";
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

  // State Hooks
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    status: "pending",
  });
  const [isLoading, setIsLoading] = useState(false);

  interface GasolineStatus {
    remaining_gasoline: number;
    gasoline_threshold: number;
    spent_gasoline: number;
  }
  const [gasolineStatus, setGasolineStatus] = useState<GasolineStatus | null>(null);
  const [isGasolineStatusLoading, setIsGasolineStatusLoading] = useState(true);

  // Custom Hooks
  const { profile, isProfileLoading, fetchProfile } = useProfile();
  const { vehicles, vehiclesAreLoading, fetchVehicles } = useVehicle();
  const { vehicleId } = useLocalSearchParams<{ vehicleId: string }>();

  useGasolineLoads();

  // Find the vehicle
  const vehicle = vehicles?.find((Vehicle) => Vehicle.id === vehicleId);

  // Function to fetch gasoline status
  const fetchGasolineStatus = async () => {
    if (!vehicle) return;

    setIsGasolineStatusLoading(true);
    const { data, error } = await supabase
      .from("vehicle_gasoline_status")
      .select("*")
      .eq("vehicle_id", vehicle.id)
      .single();

    if (error) {
      console.error("Error fetching gasoline status:", error);
    } else {
      setGasolineStatus(data);
    }
    setIsGasolineStatusLoading(false);
  };

  // useEffect Hook to fetch gasoline status
  useEffect(() => {
    fetchGasolineStatus();
  }, [vehicle]);

  // Handler Functions
  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const submitGasolineLoad = async () => {
    setIsLoading(true);
    const { data, error } = await supabase.from("gasoline_loads").insert({
      vehicle_id: vehicle?.id,
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
      setIsModalOpen(false);
      setFormData({ amount: "", status: "pending" });
      // Refresh gasoline status after adding a new load
      fetchGasolineStatus();
    }
    setIsLoading(false);
  };

  // Conditional Returns
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

  return (
    <>
      <Stack.Screen
        options={{
          title: "Historial de Gasolina",
          headerRight: () => (
            <Pressable onPress={() => setIsModalOpen(true)}>
              <Text style={styles.addButton}>Agregar</Text>
            </Pressable>
          ),
        }}
      />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View style={styles.thresholdContainer}>
          <Text style={styles.thresholdTitle}>Gasolina Restante</Text>
          {isGasolineStatusLoading ? (
            <Text>Cargando datos de gasolina...</Text>
          ) : gasolineStatus ? (
            <>
              <Text style={styles.thresholdValue}>
                ${gasolineStatus.remaining_gasoline.toFixed(2)} MXN
              </Text>
              <Text style={styles.infoText}>
                Límite: ${gasolineStatus.gasoline_threshold.toFixed(2)} MXN
              </Text>
              <Text style={styles.infoText}>
                Gastado: ${gasolineStatus.spent_gasoline.toFixed(2)} MXN
              </Text>
            </>
          ) : (
            <Text>No hay datos de gasolina disponibles.</Text>
          )}
        </View>
      </ScrollView>
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
  thresholdContainer: {
    padding: 20,
    backgroundColor: theme.ui.colors.card,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 20,
  },
  thresholdTitle: {
    fontSize: 20,
    color: theme.textPresets.main,
  },
  thresholdValue: {
    fontSize: 32,
    color: theme.textPresets.main,
    fontWeight: "bold",
  },
  infoText: {
    fontSize: 16,
    color: theme.textPresets.main,
    marginTop: 10,
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