// components/Vehicles/modals/PlateModal.tsx
import FormTitle from "@/app/auth/FormTitle";
import { FormButton } from "@/components/Form/FormButton";
import FormInput from "@/components/Form/FormInput";
import { supabase } from "@/lib/supabase";
import { Vehicle } from "@/types/globalTypes";
import { useEffect, useState } from "react";
import { View } from "react-native";
import Toast from "react-native-toast-message";
import { createStyleSheet, useStyles } from "react-native-unistyles";

interface PlateModalProps {
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

export function PlateModal({ closeModal, vehicle, refetchVehicle }: PlateModalProps) {
  const { styles } = useStyles(stylesheet);
  const [plate, setPlate] = useState(vehicle.plate ? vehicle.plate : "");
  const [isLoading, setIsLoading] = useState(false);
  const [canUpdate, setCanUpdate] = useState(false);

  useEffect(() => {
    if (vehicle.plate === plate) {
      setCanUpdate(false);
    } else {
      setCanUpdate(true);
    }
  }, [plate]);

  async function savePlate() {
    setIsLoading(true);
    const { error } = await supabase.from("vehicles").update({ plate: plate }).eq("id", vehicle.id);
    setIsLoading(false);

    if (error) {
      console.error(error);
      showToast("Error", "Ocurrió un error al guardar la placa");
      throw error;
    }

    refetchVehicle();
    closeModal();
  }

  return (
    <View style={styles.section}>
      <View style={styles.group}>
        <FormTitle title="Placa" />
      </View>
      <View style={styles.group}>
        <FormInput description="Placa" value={plate} onChangeText={setPlate} />
        <FormButton title="Guardar" onPress={savePlate} isLoading={isLoading} isDisabled={!canUpdate} />
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
