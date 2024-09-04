import { View, Text, Button } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import FormTitle from '@/app/auth/FormTitle';
import { FormButton } from '@/components/Form/FormButton';

export default function AssignTruckModalScreen() {
  const router = useRouter();
  const { styles } = useStyles(stylesheet);


  return (
    <View style={styles.modalContainer}>
      <Text style={styles.closeButton} onPress={() => router.back()}>
        Cerrar
      </Text>
      {/* Form goes here */}
      <View style={styles.section}>
        <View style={styles.group}>
          <FormTitle title={`Asignar camion a conductor`} />
          <Text style={styles.subtitle}>
          </Text>
        </View>
        <View style={styles.group}>
          <FormButton
            title="Continuar"
            onPress={() => { }}
            isLoading={false}
          />
        </View>
      </View>
    </View>
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