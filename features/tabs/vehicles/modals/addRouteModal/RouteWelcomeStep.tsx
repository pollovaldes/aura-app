import FormTitle from "@/app/auth/FormTitle";
import { FormButton } from "@/components/Form/FormButton";
import { Text, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { useCreateRoute } from "./CreateRouteContext";

export function RouteWelcomeStep() {
  const { styles } = useStyles(stylesheet);
  const { close, routeData, setField, setStep } = useCreateRoute();

  return (
    <View style={styles.section}>
      <View style={styles.group}>
        <FormTitle title="Nueva ruta" />
        <Text style={styles.subtitle}>A continuación llenarás un formulario sobre la ruta que realizarás</Text>
      </View>
      <View style={styles.group}>
        <Text style={styles.subtitle}>Título: {routeData.title}</Text>
        <Text style={styles.subtitle}>Descripción: {routeData.description}</Text>
      </View>
      <View style={styles.group}>
        <FormButton title="Continuar" onPress={() => setStep(1)} />
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
