import FormTitle from "@/app/auth/FormTitle";
import { FormButton } from "@/components/Form/FormButton";
import FormInput from "@/components/Form/FormInput";
import { supabase } from "@/lib/supabase";
import { Vehicle } from "@/types/globalTypes";
import { useEffect, useState } from "react";
import { View } from "react-native";
import Toast from "react-native-toast-message";
import { createStyleSheet, useStyles } from "react-native-unistyles";

interface YearModalProps {
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

export function YearModal({ closeModal, vehicle, refetchVehicle }: YearModalProps) {
  const { styles } = useStyles(stylesheet);
  const [year, setYear] = useState(vehicle.year ? vehicle.year.toString() : "");
  const [isLoading, setIsLoading] = useState(false);
  const [canUpdate, setCanUpdate] = useState(false);

  useEffect(() => {
    const isNumeric = /^\d+$/.test(year);
    if (vehicle.year?.toString() === year || !isNumeric) {
      setCanUpdate(false);
    } else {
      setCanUpdate(true);
    }
  }, [year]);

  async function saveYear() {
    setIsLoading(true);
    const parsedYear = parseInt(year, 10);

    const { error } = await supabase.from("vehicles").update({ year: parsedYear }).eq("id", vehicle.id);
    setIsLoading(false);

    if (error) {
      console.error(error);
      showToast("Error", "Ocurrió un error al guardar el año");
      throw error;
    }

    refetchVehicle();
    closeModal();
  }

  return (
    <View style={styles.section}>
      <View style={styles.group}>
        <FormTitle title="Año" />
      </View>
      <View style={styles.group}>
        <FormInput description="Año" value={year} onChangeText={setYear} keyboardType="number-pad" />
        <FormButton title="Guardar" onPress={saveYear} isLoading={isLoading} isDisabled={!canUpdate} />
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
