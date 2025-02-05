// components/Vehicles/modals/SerialNumberModal.tsx
import FormTitle from "@/app/auth/FormTitle";
import { FormButton } from "@/components/Form/FormButton";
import FormInput from "@/components/Form/FormInput";
import { supabase } from "@/lib/supabase";
import { Vehicle } from "@/types/globalTypes";
import { useEffect, useState } from "react";
import { View } from "react-native";
import Toast from "react-native-toast-message";
import { createStyleSheet, useStyles } from "react-native-unistyles";

interface SerialNumberModalProps {
  closeModal: () => void;
  refetchVehicle: () => void;
  vehicle: Vehicle;
}

function showToast(title: string, caption: string) {
  Toast.show({
    type: "alert",
    text1: title,
    text2: caption,
  });
}

export function SerialNumberModal({ closeModal, vehicle, refetchVehicle }: SerialNumberModalProps) {
  const { styles } = useStyles(stylesheet);
  const [serialNumber, setSerialNumber] = useState(vehicle.serial_number ? vehicle.serial_number : "");
  const [isLoading, setIsLoading] = useState(false);
  const [canUpdate, setCanUpdate] = useState(false);

  useEffect(() => {
    if (vehicle.serial_number === serialNumber) {
      setCanUpdate(false);
    } else {
      setCanUpdate(true);
    }
  }, [serialNumber]);

  async function saveSerialNumber() {
    setIsLoading(true);
    const { error } = await supabase.from("vehicle").update({ serial_number: serialNumber }).eq("id", vehicle.id);
    setIsLoading(false);

    if (error) {
      console.error(error);
      showToast("Error", "Ocurrió un error al guardar el número de serie");
      throw error;
    }

    refetchVehicle();
    closeModal();
  }

  return (
    <View style={styles.section}>
      <View style={styles.group}>
        <FormTitle title="Número de Serie" />
      </View>
      <View style={styles.group}>
        <FormInput description="Número de Serie" value={serialNumber} onChangeText={setSerialNumber} />
        <FormButton title="Guardar" onPress={saveSerialNumber} isLoading={isLoading} isDisabled={!canUpdate} />
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
}));
