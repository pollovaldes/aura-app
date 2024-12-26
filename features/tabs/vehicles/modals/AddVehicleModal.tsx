import FormTitle from "@/app/auth/FormTitle";
import { FormButton } from "@/components/Form/FormButton";
import FormInput from "@/components/Form/FormInput";
import { useAddVehicle } from "@/features/tabs/vehicles/hooks/useAddVehicle";
import { router } from "expo-router";
import { useEffect } from "react";
import { Text, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

interface AddVehicleModalProps {
  close: () => void;
}

export function AddVehicleModal({ close }: AddVehicleModalProps) {
  const { styles } = useStyles(stylesheet);
  const {
    setBrand,
    setSubBrand,
    setYear,
    setPlate,
    setSerialNumber,
    setEconomicNumber,
    createVehicle,
    vehicle,
    loading,
    allFieldsAreValid,
  } = useAddVehicle();

  useEffect(() => {
    if (vehicle && !loading) {
      close();
      router.push(`./${vehicle.id}`, { relativeToDirectory: true });
    }
  }, [vehicle, loading]);

  return (
    <View style={styles.section}>
      <View style={styles.group}>
        <FormTitle title="Registrar un nuevo vehículo" />
        <Text style={styles.subtitle}>Ingresa los datos del vehículo a continuación</Text>
      </View>
      <View style={styles.group}>
        <FormInput placeholder="Ej. Mack" inputMode="text" onChangeText={setBrand} description={"Marca del vehículo"} />
        <FormInput
          placeholder="Ej. Anthem"
          inputMode="text"
          onChangeText={setSubBrand}
          description={"Submarca del vehículo"}
        />
        <FormInput placeholder="Ej. 2022" inputMode="numeric" onChangeText={setYear} description={"Año del vehículo"} />
        <FormInput
          placeholder="Ej. QRS-3456"
          inputMode="text"
          autoCorrect={false}
          onChangeText={setPlate}
          description={"Placa del vehículo"}
        />
        <FormInput
          placeholder="Ej. 1M1AN07Y4KM123456"
          inputMode="text"
          autoCorrect={false}
          onChangeText={setSerialNumber}
          description={"Número de serie del vehículo"}
        />
        <FormInput
          placeholder="Ej. ECO-6784"
          inputMode="text"
          autoCorrect={false}
          onChangeText={setEconomicNumber}
          description={"Número económico del vehículo"}
        />
      </View>
      <View style={styles.group}>
        <FormButton title="Registrar" onPress={createVehicle} isLoading={loading} isDisabled={!allFieldsAreValid} />
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
