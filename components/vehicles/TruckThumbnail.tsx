import { Truck as TruckIcon } from "lucide-react-native";
import { ActivityIndicator, Image, View } from "react-native";
import { useStyles, createStyleSheet } from "react-native-unistyles";
import useVehicle from "@/hooks/truckHooks/useVehicle";
import { useEffect, useState } from "react";
import { Vehicle } from "@/types/Vehicle";
import useVehicleThumbnail from "@/hooks/truckHooks/useVehicleThumbnail";

type VehicleThumbnailProps = {
  vehicleId: string;
};

export default function VehicleThumbnail({ vehicleId }: VehicleThumbnailProps) {
  const { styles } = useStyles(stylesheet);
  const { vehicles, setVehicles } = useVehicle();
  const { fetchThumbnail } = useVehicleThumbnail();
  const [thumbnailIsLoading, setThumbnailIsLoading] = useState(false);

  if (!vehicles) return null;
  const item = vehicles.find((truck) => truck.id === vehicleId);

  useEffect(() => {
    if (!item) {
      setThumbnailIsLoading(false);
      return;
    }

    setThumbnailIsLoading(true);

    const loadThumbnail = async () => {
      if (item.thumbnail) {
        setThumbnailIsLoading(false);
        return;
      }

      const thumbnail = await fetchThumbnail(vehicleId);
      if (thumbnail) {
        setVehicles(
          (prevVehicles: Vehicle[] | null) =>
            prevVehicles?.map((truck) =>
              truck.id === vehicleId ? { ...truck, thumbnail } : truck
            ) || null
        );
      }
      setThumbnailIsLoading(false);
    };

    loadThumbnail();
  }, []);

  return (
    <>
      {thumbnailIsLoading ? (
        <View style={styles.emptyImageContainer}>
          <ActivityIndicator />
        </View>
      ) : item && item.thumbnail ? (
        <Image style={styles.image} source={{ uri: item.thumbnail }} />
      ) : (
        <View style={styles.emptyImageContainer}>
          <TruckIcon
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
