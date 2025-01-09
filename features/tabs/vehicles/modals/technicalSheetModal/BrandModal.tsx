import FormTitle from "@/app/auth/FormTitle";
import { FormButton } from "@/components/Form/FormButton";
import FormInput from "@/components/Form/FormInput";
import { supabase } from "@/lib/supabase";
import { Vehicle } from "@/types/globalTypes";
import { useEffect, useState } from "react";
import { View } from "react-native";
import Toast from "react-native-toast-message";
import { createStyleSheet, useStyles } from "react-native-unistyles";

interface BrandModalProps {
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

export function BrandModal({ closeModal, vehicle, refetchVehicle }: BrandModalProps) {
  const { styles } = useStyles(stylesheet);
  const [brand, setBrand] = useState(vehicle.brand ? vehicle.brand : "");
  const [isLoading, setIsLoading] = useState(false);
  const [canUpdate, setCanUpdate] = useState(false);

  useEffect(() => {
    if (vehicle.brand === brand) {
      setCanUpdate(false);
    } else {
      setCanUpdate(true);
    }
  }, [brand]);

  async function saveBrand() {
    setIsLoading(true);
    const { error } = await supabase.from("vehicles").update({ brand: brand }).eq("id", vehicle.id);
    setIsLoading(false);

    if (error) {
      console.error(error);
      showToast("Error", "Ocurrió un error al guardar la marca");
      throw error;
    }

    refetchVehicle();
    closeModal();
  }

  return (
    <View style={styles.section}>
      <View style={styles.group}>
        <FormTitle title="Marca" />
      </View>
      <View style={styles.group}>
        <FormInput description="Marca" value={brand} onChangeText={setBrand} />
        <FormButton title="Guardar" onPress={() => saveBrand()} isLoading={isLoading} isDisabled={!canUpdate} />
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
