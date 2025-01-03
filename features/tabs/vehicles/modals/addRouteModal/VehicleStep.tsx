import FormTitle from "@/app/auth/FormTitle";
import { FormButton } from "@/components/Form/FormButton";
import { Text, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { useCreateRoute } from "./CreateRouteContext";
import FormInput from "@/components/Form/FormInput";
import { useState } from "react";
import { BackButtonOverlay } from "./BackButtonOverlay";

export function VehicleStep() {
  const { styles } = useStyles(stylesheet);
  const { setStep, setField, routeData } = useCreateRoute();

  return (
    <View style={styles.section}>
      <BackButtonOverlay back={() => setStep(2)} />
      <View style={styles.group}>
        <FormTitle title="¿Con qué vehículo harás la ruta?" />
        <Text style={styles.subtitle}>Elige un vehículo de tus flotillas </Text>
      </View>
      <View style={styles.group}>
        
      </View>
      <View style={styles.group}>
        <FormButton title="Continuar" onPress={() => setStep(3)} />
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
  subtitle: {
    color: theme.textPresets.subtitle,
    textAlign: "center",
  },
}));
