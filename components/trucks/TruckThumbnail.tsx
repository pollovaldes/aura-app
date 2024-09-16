import { Truck } from "lucide-react-native";
import { ActivityIndicator, Image, View } from "react-native";
import { useStyles, createStyleSheet } from "react-native-unistyles";
import useTruck from "@/hooks/truckHooks/useTruck";
import useTruckThumbnail from "@/hooks/truckHooks/useTruckThumbnail";

type TruckThumbnailProps = {
  truckId: string;
};

export default function TruckThumbnail({ truckId }: TruckThumbnailProps) {
  const { styles } = useStyles(stylesheet);
  const { trucks, setTrucks } = useTruck();

  if (!trucks) return null;
  const item = trucks.find((truck) => truck.id === truckId);
  if (!item) return null;

  const { thumbnailIsLoading } = useTruckThumbnail(truckId, trucks, setTrucks);

  return (
    <>
      {thumbnailIsLoading ? (
        <View style={styles.emptyImageContainer}>
          <ActivityIndicator />
        </View>
      ) : item.thumbnail ? (
        <Image style={styles.image} source={{ uri: item.thumbnail }} />
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
