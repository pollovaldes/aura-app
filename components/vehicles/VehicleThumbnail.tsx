import { useVehicleThumbnail } from "@/hooks/useVehicleThumbnail";
import { TruckIcon } from "lucide-react-native";
import React from "react";
import { View, Image, ActivityIndicator, StyleSheet } from "react-native";

interface VehicleThumbnailProps {
  vehicleId: string;
}

export function VehicleThumbnail({ vehicleId }: VehicleThumbnailProps) {
  const { thumbnail } = useVehicleThumbnail(vehicleId);

  return (
    <>
      {thumbnail?.isLoading ? (
        <View style={styles.emptyImageContainer}>
          <ActivityIndicator />
        </View>
      ) : thumbnail?.imageURI ? (
        <Image style={styles.image} source={{ uri: thumbnail.imageURI }} />
      ) : (
        <View style={styles.emptyImageContainer}>
          <TruckIcon size={35} color={styles.noImageIcon.color} strokeWidth={1.25} />
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  emptyImageContainer: {
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  noImageIcon: {
    color: "#ccc",
  },
});
