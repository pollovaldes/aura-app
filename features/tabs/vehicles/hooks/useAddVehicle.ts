import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Toast from "react-native-toast-message";
import { Vehicle } from "@/types/globalTypes";

export function useAddVehicle() {
  const [brand, setBrand] = useState("");
  const [subBrand, setSubBrand] = useState("");
  const [year, setYear] = useState("");
  const [plate, setPlate] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [economicNumber, setEconomicNumber] = useState("");
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(false);
  const [allFieldsAreValid, setAllFieldsAreValid] = useState(false);

  function isNumeric(value: string) {
    return /^-?\d+$/.test(value);
  }

  useEffect(() => {
    setAllFieldsAreValid(
      brand.length > 0 &&
        subBrand.length > 0 &&
        year.length > 0 &&
        isNumeric(year) &&
        plate.length > 0 &&
        serialNumber.length > 0 &&
        economicNumber.length > 0
    );
  }, [brand, subBrand, year, plate, serialNumber, economicNumber]);

  const showToast = (title: string, caption: string) => {
    Toast.show({
      type: "alert",
      text1: title,
      text2: caption,
    });
  };

  const createVehicle = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("vehicle")
      .insert([
        {
          brand: brand,
          sub_brand: subBrand,
          year: parseInt(year),
          plate,
          serial_number: serialNumber,
          economic_number: economicNumber,
        },
      ])
      .select()
      .single();

    if (error) {
      showToast("Error", "No se pudo registrar el vehículo.");
      setVehicle(null);
      setLoading(false);
      return;
    }

    showToast("Éxito", "Se ha registrado el vehículo correctamente.");
    setVehicle(data);
    setLoading(false);
  };

  return {
    brand,
    setBrand,
    subBrand,
    setSubBrand,
    year,
    setYear,
    plate,
    setPlate,
    serialNumber,
    setSerialNumber,
    economicNumber,
    setEconomicNumber,
    createVehicle,
    loading,
    allFieldsAreValid,
    vehicle,
  };
}
