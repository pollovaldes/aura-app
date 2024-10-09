import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Vehicle } from "@/types/Vehicle";
import useVehicle from "./useVehicle";

export function useAddVehicle() {
  const [brand, setBrand] = useState("");
  const [subBrand, setSubBrand] = useState("");
  const [year, setYear] = useState("");
  const [plate, setPlate] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [economicNumber, setEconomicNumber] = useState("");
  const [vehicle, setVehicle] = useState<Vehicle>();
  const [loading, setLoading] = useState(false);

  const resetFields = () => {
    setBrand("");
    setSubBrand("");
    setYear("");
    setPlate("");
    setSerialNumber("");
    setEconomicNumber("");
  };

  const createVehicle = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("vehicles")
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
      .select();

    if (error) {
      alert("Ocurrió un error al registrar el vehículo\n" + error.message);
      setLoading(false);
    }

    if (data && data.length > 0) {
      const isVehicle = (value: any): value is Vehicle => {
        return (
          typeof value === "object" &&
          value !== null &&
          ("brand" in value ||
            "sub_brand" in value ||
            "year" in value ||
            "plate" in value ||
            "serial_number" in value ||
            "economic_number" in value)
        );
      };

      if (isVehicle(data[0])) {
        const vehicle = data[0] as Vehicle;
        setVehicle(vehicle);
      } else {
        console.log("This is not a Vehicle.");
      }

      setLoading(false);
    }
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
    vehicle,
  };
}
