import FormTitle from "@/app/auth/FormTitle";
import { FormButton } from "@/components/Form/FormButton";
import FormInput from "@/components/Form/FormInput";
import { supabase } from "@/lib/supabase";
import { Vehicle } from "@/types/globalTypes";
import { useEffect, useState } from "react";
import { View } from "react-native";
import Toast from "react-native-toast-message";
import { createStyleSheet, useStyles } from "react-native-unistyles";

interface SubBrandModalProps {
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

export function SubBrandModal({ closeModal, vehicle, refetchVehicle }: SubBrandModalProps) {
  const { styles } = useStyles(stylesheet);
  const [subBrand, setSubBrand] = useState(vehicle.sub_brand ? vehicle.sub_brand : "");
  const [isLoading, setIsLoading] = useState(false);
  const [canUpdate, setCanUpdate] = useState(false);

  useEffect(() => {
    if (vehicle.sub_brand === subBrand) {
      setCanUpdate(false);
    } else {
      setCanUpdate(true);
    }
  }, [subBrand]);

  async function saveSubBrand() {
    setIsLoading(true);
    const { error } = await supabase.from("vehicle").update({ sub_brand: subBrand }).eq("id", vehicle.id);
    setIsLoading(false);

    if (error) {
      console.error(error);
      showToast("Error", "Ocurrió un error al guardar la submarca");
      throw error;
    }

    refetchVehicle();
    closeModal();
  }

  return (
    <View style={styles.section}>
      <View style={styles.group}>
        <FormTitle title="Submarca" />
      </View>
      <View style={styles.group}>
        <FormInput description="Submarca" value={subBrand} onChangeText={setSubBrand} />
        <FormButton title="Guardar" onPress={saveSubBrand} isLoading={isLoading} isDisabled={!canUpdate} />
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
