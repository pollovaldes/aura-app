import FormTitle from "@/app/auth/FormTitle";
import { FormButton } from "@/components/Form/FormButton";
import FormInput from "@/components/Form/FormInput";
import { supabase } from "@/lib/supabase";
import { Vehicle } from "@/types/globalTypes";
import { useEffect, useState } from "react";
import { View } from "react-native";
import Toast from "react-native-toast-message";
import { createStyleSheet, useStyles } from "react-native-unistyles";

interface EconomicNumberModalProps {
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

export function EconomicNumberModal({ closeModal, vehicle, refetchVehicle }: EconomicNumberModalProps) {
  const { styles } = useStyles(stylesheet);
  const [economicNumber, setEconomicNumber] = useState(vehicle.economic_number ? vehicle.economic_number : "");
  const [isLoading, setIsLoading] = useState(false);
  const [canUpdate, setCanUpdate] = useState(false);

  useEffect(() => {
    if (vehicle.economic_number === economicNumber) {
      setCanUpdate(false);
    } else {
      setCanUpdate(true);
    }
  }, [economicNumber]);

  async function saveEconomicNumber() {
    setIsLoading(true);
    const { error } = await supabase.from("vehicles").update({ economic_number: economicNumber }).eq("id", vehicle.id);
    setIsLoading(false);

    if (error) {
      console.error(error);
      showToast("Error", "Ocurrió un error al guardar el número económico");
      throw error;
    }

    refetchVehicle();
    closeModal();
  }

  return (
    <View style={styles.section}>
      <View style={styles.group}>
        <FormTitle title="Número económico" />
      </View>
      <View style={styles.group}>
        <FormInput description="Número económico" value={economicNumber} onChangeText={setEconomicNumber} />
        <FormButton
          title="Guardar"
          onPress={() => saveEconomicNumber()}
          isLoading={isLoading}
          isDisabled={!canUpdate}
        />
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
