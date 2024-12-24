import VehiclesContext from "@/context/VehiclesContext";
import { supabase } from "@/lib/supabase";
import { useContext, useEffect } from "react";

export function useVehicleThumbnail(vehicleId: string) {
  const { vehicleThumbnails, setVehicleThumbnails } = useContext(VehiclesContext);

  const thumbnail = vehicleThumbnails.find((thumbnail) => thumbnail.vehicleId === vehicleId);

  const convertBlobToBase64 = async (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const fetchImage = async () => {
    const { data, error } = await supabase.storage
      .from("imagenes-camiones/0cb45272-4766-4e95-8932-8ed7b73a8223/perfil/")
      .download(`1734188705930.webp`);

    if (error) {
      setVehicleThumbnails((prev) =>
        prev.map((item) => (item.vehicleId === vehicleId ? { ...item, isLoading: false, imageURI: null } : item))
      );
      throw error;
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const imageURI = await convertBlobToBase64(data);

    if (error) {
      throw error;
    }

    setVehicleThumbnails((prev) =>
      prev.map((item) => (item.vehicleId === vehicleId ? { ...item, isLoading: false, imageURI } : item))
    );
  };

  const refetchVehicleThumbnail = async () => {
    console.log("Refetching thumbnail for vehicle", vehicleId);
    // Set isLoading to true for the specific vehicle
    setVehicleThumbnails((prev) =>
      prev.map((item) =>
        item.vehicleId === vehicleId
          ? { ...item, isLoading: true, imageURI: null } // Reset imageURI to null for a fresh fetch
          : item
      )
    );

    await fetchImage(); // Ensure the fetchImage function is called
  };

  useEffect(() => {
    if (!thumbnail) {
      setVehicleThumbnails((prev) => [...prev, { vehicleId, isLoading: true, imageURI: null }]);
      fetchImage();
    }
  }, []);

  return {
    thumbnail,
    refetchVehicleThumbnail,
  };
}
