import useTruck from "@/hooks/truckHooks/useTruck";
import { supabase } from "@/lib/supabase";
import { Truck } from "lucide-react-native";
import { useEffect, useState } from "react";
import { ActivityIndicator, Image, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

type TruckThumbnailProps = {
  truckId: string;
};

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
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => {
      console.error("Error reading the profile image");
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

export default function TruckThumbnail({ truckId }: TruckThumbnailProps) {
  const { styles } = useStyles(stylesheet);
  const { trucks, setTrucks } = useTruck();

  if (!trucks) return null; //TODO make a better error handling
  const item = trucks.find((truck) => truck.id === truckId); //Up to here I know which truck im talking about
  if (!item) return null; //TODO make a better error handling

  const [thumbnailIsLoading, setThumbnailIsLoading] = useState(true); // local state to handle loading of thumbnail

  useEffect(() => {
    const loadThumbnail = async () => {
      // Check if the thumbnail already exists in the truck's data
      if (item.thumbnail) {
        setThumbnailIsLoading(false); // Thumbnail is already loaded
        return;
      }

      const thumbnail = await fetchThumbnail(truckId);
      if (thumbnail) {
        // Update only the specific truck's thumbnail in the global state
        setTrucks(
          (prevTrucks) =>
            prevTrucks?.map((truck) =>
              truck.id === truckId ? { ...truck, thumbnail } : truck
            ) || null
        );
      }
      setThumbnailIsLoading(false); // Stop the loading indicator
    };

    loadThumbnail(); // Run on mount
  }, []); // No dependencies, run only on mount

  const isValidThumbnail =
    item.thumbnail &&
    typeof item.thumbnail === "string" &&
    item.thumbnail.length >= 150;

  return (
    <>
      {thumbnailIsLoading ? (
        <View style={styles.emptyImageContainer}>
          <ActivityIndicator />
        </View>
      ) : isValidThumbnail ? (
        <Image
          style={styles.image}
          source={{ uri: item.thumbnail as string }}
        />
      ) : (
        <View style={styles.emptyImageContainer}>
          <Truck
            size={35}
            color={styles.noImageIcon.color}
            strokeWidth={1.25}
          />
        </View>
      )}
    </>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  image: {
    borderRadius: 6,
    width: 100,
    height: 100,
  },
  emptyImageContainer: {
    borderRadius: 6,
    backgroundColor: theme.ui.colors.border,
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  noImageIcon: {
    color: theme.textPresets.main,
  },
}));
