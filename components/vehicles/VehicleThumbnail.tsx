import { useVehicleThumbnail } from "@/hooks/useVehicleThumbnail";
import { TruckIcon } from "lucide-react-native";
import React from "react";
import { View, Image, ActivityIndicator, StyleSheet, Platform } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

interface VehicleThumbnailProps {
  vehicleId: string;
}

export function VehicleThumbnail({ vehicleId }: VehicleThumbnailProps) {
  const { thumbnail } = useVehicleThumbnail(vehicleId);
  const { styles, theme } = useStyles(stylesheet);

  return (
    <>
      {thumbnail?.isLoading ? (
        <View style={styles.emptyImageContainer}>
          <ActivityIndicator color={Platform.OS !== "ios" ? theme.ui.colors.primary : undefined} />
        </View>
      ) : thumbnail?.imageURI ? (
        <Image style={styles.image} source={{ uri: thumbnail.imageURI }} />
      ) : (
        <View style={styles.emptyImageContainer}>
          <TruckIcon size={40} color={styles.noImageIcon.color} strokeWidth={1.25} />
        </View>
      )}
    </>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  emptyImageContainer: {
    width: 120,
    height: 120,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.ui.colors.border,
    borderRadius: 16,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 16,
  },
  noImageIcon: {
    color: theme.textPresets.subtitle,
  },
}));
