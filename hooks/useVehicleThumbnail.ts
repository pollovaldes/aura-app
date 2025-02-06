import { VehiclesContext } from "@/context/VehiclesContext";
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

  const fetchThumbnail = async () => {
    const { data: fileList, error: listError } = await supabase.storage
      .from("vehicles-thumbnails")
      .list(`${vehicleId}/`, { limit: 1 });

    if (listError || !fileList || fileList.length === 0) {
      setVehicleThumbnails((prev) =>
        prev.map((item) => (item.vehicleId === vehicleId ? { ...item, isLoading: false, imageURI: null } : item))
      );
      return;
    }

    const firstFile = fileList[0];

    if (!firstFile) {
      setVehicleThumbnails((prev) =>
        prev.map((item) => (item.vehicleId === vehicleId ? { ...item, isLoading: false, imageURI: null } : item))
      );
      return;
    }

    const { data: fileData, error: fetchError } = await supabase.storage
      .from("vehicles-thumbnails")
      .download(`${vehicleId}/${firstFile.name}`);

    if (fetchError || !fileData) {
      setVehicleThumbnails((prev) =>
        prev.map((item) => (item.vehicleId === vehicleId ? { ...item, isLoading: false, imageURI: null } : item))
      );
      console.error("Error fetching file", fetchError);
      return;
    }

    const imageURI = await convertBlobToBase64(fileData);

    setVehicleThumbnails((prev) =>
      prev.map((item) => (item.vehicleId === vehicleId ? { ...item, isLoading: false, imageURI } : item))
    );
  };

  const fetchThumbnailForVehicle = async (vehicleId: string) => {
    const { data: fileList, error: listError } = await supabase.storage
      .from("vehicles-thumbnails")
      .list(`${vehicleId}/`, { limit: 1 });

    if (listError || !fileList || fileList.length === 0) {
      setVehicleThumbnails((prev) => [...prev, { vehicleId, isLoading: false, imageURI: null }]);
      return;
    }

    const firstFile = fileList[0];

    if (!firstFile) {
      setVehicleThumbnails((prev) => [...prev, { vehicleId, isLoading: false, imageURI: null }]);
      return;
    }

    const { data: fileData, error: fetchError } = await supabase.storage
      .from("vehicles-thumbnails")
      .download(`${vehicleId}/${firstFile.name}`);

    if (fetchError || !fileData) {
      setVehicleThumbnails((prev) => [...prev, { vehicleId, isLoading: false, imageURI: null }]);
      console.error("Error fetching file", fetchError);
      return;
    }

    const imageURI = await convertBlobToBase64(fileData);

    setVehicleThumbnails((prev) => [...prev, { vehicleId, isLoading: false, imageURI }]);
  };

  const refetchThumbnailsForVehicles = async (vehicleIds: string[]) => {
    setVehicleThumbnails((prev) => prev.filter((item) => !vehicleIds.includes(item.vehicleId)));

    for (const vehicleId of vehicleIds) {
      await fetchThumbnailForVehicle(vehicleId);
    }
  };

  const refetchVehicleThumbnail = async () => {
    setVehicleThumbnails((prev) =>
      prev.map((item) => (item.vehicleId === vehicleId ? { ...item, isLoading: true, imageURI: null } : item))
    );

    await fetchThumbnail();
  };

  const refetchAllVehicleThumbnails = async () => {
    setVehicleThumbnails((prev) =>
      prev.map((item) => (item.vehicleId === vehicleId ? { ...item, isLoading: true, imageURI: null } : item))
    );

    for (const thumbnail of vehicleThumbnails) {
      await fetchThumbnail();
    }
  };

  useEffect(() => {
    if (!thumbnail) {
      setVehicleThumbnails((prev) => [...prev, { vehicleId, isLoading: true, imageURI: null }]);
      fetchThumbnail();
    }
  }, []);

  return {
    thumbnail,
    refetchVehicleThumbnail,
    refetchThumbnailsForVehicles,
  };
}
