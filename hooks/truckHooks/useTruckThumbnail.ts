import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Truck } from "@/types/Truck";

const listProfileImages = async (truckId: string) => {
  const { data, error } = await supabase.storage
    .from("imagenes-camiones")
    .list(`${truckId}/perfil`);

  if (error) {
    console.error(`Error listing thumbnails for ${truckId}: `, error);
    return null;
  }

  return data?.length ? data[0].name : null;
};

const downloadImage = async (truckId: string, fileName: string) => {
  const { data: downloadData, error: downloadError } = await supabase.storage
    .from("imagenes-camiones")
    .download(`${truckId}/perfil/${fileName}`);

  if (downloadError) {
    console.error(
      `Error downloading thumbnail for ${truckId}: `,
      downloadError
    );
    return null;
  }

  return downloadData;
};

const readImageAsDataURL = (file: Blob): Promise<string | null> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      if (result && result.length >= 150) {
        resolve(result);
      } else {
        console.log("Invalid image data, too short or undefined.");
        resolve(null);
      }
    };
    reader.onerror = () => {
      console.error("Error reading profile image");
      reject(null);
    };
    reader.readAsDataURL(file);
  });
};

const fetchThumbnail = async (truckId: string): Promise<string | null> => {
  try {
    const fileName = await listProfileImages(truckId);
    if (!fileName) return null;

    const file = await downloadImage(truckId, fileName);
    if (!file) return null;

    return await readImageAsDataURL(file);
  } catch (error) {
    console.error(`Error fetching profile image for ${truckId}: `, error);
    return null;
  }
};

const useTruckThumbnail = (
  truckId: string,
  trucks: Truck[] | null,
  setTrucks: any
) => {
  const [thumbnailIsLoading, setThumbnailIsLoading] = useState(true);
  const item = trucks?.find((truck) => truck.id === truckId);
  if (!item) return;

  useEffect(() => {
    if (!item) {
      // Truck not found, no need to proceed
      setThumbnailIsLoading(false);
      return;
    }

    setThumbnailIsLoading(true);

    const loadThumbnail = async () => {
      if (item.thumbnail) {
        setThumbnailIsLoading(false);
        return;
      }

      const thumbnail = await fetchThumbnail(truckId);
      if (thumbnail) {
        setTrucks(
          (prevTrucks: Truck[] | null) =>
            prevTrucks?.map((truck) =>
              truck.id === truckId ? { ...truck, thumbnail } : truck
            ) || null
        );
      }
      setThumbnailIsLoading(false);
    };

    loadThumbnail();
  }, []);

  return { thumbnailIsLoading };
};

export default useTruckThumbnail;
