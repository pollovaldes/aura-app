import FormTitle from "@/app/auth/FormTitle";
import { ConfirmDialog } from "@/components/alert/ConfirmDialog";
import React, { useEffect } from "react";
import { useState } from "react";
import { ActivityIndicator, Platform, Text, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import FormInput from "@/components/Form/FormInput";
import { FormButton } from "@/components/Form/FormButton";
import { Route } from "@/types/globalTypes";

interface FuelModalProps {
  close: () => void;
  activeRoute: Route;
}

export function FuelModal({ close, activeRoute }: FuelModalProps) {
  const { styles, theme } = useStyles(stylesheet);
  const [proceed, setProceed] = useState(false);
  const { currentStop, currentStopIsLoading, saveCurrentStop } = useCurrentStop();
  const [liters, setLiters] = useState(currentStop?.refueling_events?.[0]?.fuel_amount?.toString() || "");
  const [mileage, setMileage] = useState(currentStop?.refueling_events?.[0]?.mileage?.toString() || "");
  const [price, setPrice] = useState(currentStop?.refueling_events?.[0]?.cost?.toString() || "");
  const [maySubmit, setMaySubmit] = useState(false);

  useEffect(() => {
    const registerStop = ConfirmDialog({
      title: "Confirmación",
      message: `¿Estás seguro de que quieres registrar una parada?`,
      cancelText: "Cancelar",
      confirmText: "Iniciar parada",
      confirmStyle: "default",
      onConfirm: () => {
        setProceed(true);
      },
      onCancel: () => {
        close();
        return;
      },
    });

    if (!currentStop) {
      registerStop.showDialog();
      return;
    }

    setProceed(true);
  }, []);

  useEffect(() => {
    if (proceed) {
      saveCurrentStop({
        ...currentStop,
        event_type: "REFUELING",
        route_id: activeRoute.id,
        started_at: new Date().toISOString(),
      });
    }
  }, [proceed]);

  useEffect(() => {
    const isPriceNumeric = /^\d+(\.\d+)?$/.test(price);
    const isLitersNumeric = /^\d+(\.\d+)?$/.test(liters);
    const isMileageNumeric = /^\d+(\.\d+)?$/.test(mileage);

    if (!isPriceNumeric || !isLitersNumeric || !isMileageNumeric) {
      setMaySubmit(false);
    } else {
      setMaySubmit(true);
    }

    saveCurrentStop({
      ...currentStop,
      refueling_events: [
        {
          fuel_amount: parseFloat(liters),
          cost: parseFloat(price),
          mileage: parseFloat(mileage),
          route_event_id: "",
          id: "",
        },
      ],
    });
  }, [price, liters, mileage]);

  if (!proceed) {
    return (
      <View style={styles.section}>
        <View style={[styles.group, { alignItems: "center" }]}>
          <ActivityIndicator color={Platform.OS !== "ios" ? theme.ui.colors.primary : undefined} />
          <Text style={styles.waitingStopText}>Esperando confirmación</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.section}>
      <View style={styles.group}>
        <FormTitle title="Registro de combustible" />
      </View>
      <View style={styles.group}>
        <FormInput description="Litros cargados (L)" keyboardType="numeric" onChangeText={setLiters} value={liters} />
        <FormInput description="Precio (MXN)" keyboardType="numeric" onChangeText={setPrice} value={price} />
        <FormInput
          description="Kilometraje actual (km)"
          keyboardType="numeric"
          onChangeText={setMileage}
          value={mileage}
        />
      </View>
      <View style={styles.group}>
        <FormButton title="Continuar" onPress={() => {}} isLoading={currentStopIsLoading} isDisabled={!maySubmit} />
      </View>
    </View>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  section: {
    gap: theme.marginsComponents.section,
  },
  group: {
    gap: theme.marginsComponents.group,
  },
  waitingStopText: {
    color: theme.textPresets.main,
    fontSize: 16,
  },
}));
