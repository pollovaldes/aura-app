import FormTitle from "@/app/auth/FormTitle";
import FormInput from "@/components/Form/FormInput";
import useMaintenance from "@/hooks/useMaintenance";
import { Person } from "@/types/Person";
import { Vehicle } from "@/types/Vehicle";
import { Text, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

interface addMaintenanceModalProps {
  closeModal: () => void;
  fetchMaintenance: () => void;
  vehicle: Vehicle;
  profile: Person;
}

export default function AddMaintenance({
  closeModal,
  vehicle,
  profile,
  fetchMaintenance,
}: addMaintenanceModalProps) {
  const { styles } = useStyles(stylesheet);
  const vehicleTitle = `${vehicle.brand ?? ""} ${vehicle.sub_brand ?? ""} (${vehicle.year ?? ""})`;
  const fullName = `${profile.name} ${profile.father_last_name} ${profile.mother_last_name}`;

  return (
    <View style={styles.section}>
      <View style={styles.group}>
        <FormTitle title={"Generar solicitud de mantenimiento"} />
        <Text style={styles.subtitle}>Llena el siguiente formulario</Text>
      </View>
      <View style={styles.group}>
        <FormInput
          description="Vehículo al que se le solicita el mantenimiento:"
          placeholder={vehicleTitle}
          editable={false}
        />
        <FormInput
          description="Quien solicita el mantenimiento:"
          placeholder={fullName}
          editable={false}
        />
      </View>
      <View style={styles.group}>
        <FormTitle title={"Información general"} />
        <FormInput
          description="Título de la solicitud"
          placeholder="Ej. Cambio de aceite"
        />
        <FormInput
          description="Descripción detallada"
          placeholder="Ej. El vehículo necesita un cambio de aceite urgente."
          multiline
        />
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
  loadingContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  text: {
    color: theme.textPresets.main,
    fontSize: 16,
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 10,
    width: "100%",
  },
  coverImage: {
    width: "100%",
    aspectRatio: 16 / 9,
    borderRadius: 10,
  },
  iconColor: {
    color: theme.textPresets.inverted,
  },
}));
