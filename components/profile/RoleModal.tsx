import FormTitle from "@/app/auth/FormTitle";
import { FormButton } from "@/components/Form/FormButton";
import { Text, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

export default function RoleModal({ closeModal }: { closeModal: () => void }) {
  const { styles } = useStyles(stylesheet);

  return (
    <View style={styles.section}>
      <View style={styles.group}>
        <FormTitle title="Rol" />
        <Text style={styles.subtitle}>Información sobre tu rol</Text>
      </View>
      <View style={styles.group}>
        <Text style={styles.subtitle}>
          En el futuro debe de venir una advertencia o bien una explicación del
          rol actual
        </Text>
        <FormButton title="Aceptar" onPress={closeModal} />
      </View>
    </View>
  );
}

const stylesheet = createStyleSheet((theme) => ({
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
