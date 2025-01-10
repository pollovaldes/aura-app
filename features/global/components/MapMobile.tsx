import React, { useEffect, useRef } from "react";
import { View, Platform, StyleSheet } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { CameraRef } from "@maplibre/maplibre-react-native";

let MapLibreGL: typeof import("@maplibre/maplibre-react-native");
if (Platform.OS === "ios" || Platform.OS === "android") {
  MapLibreGL = require("@maplibre/maplibre-react-native").default;
  MapLibreGL.setAccessToken(null); // Necessary for the map to work on Android
}

interface MapMobileProps {
  latitude: number;
  longitude: number;
  refocusTrigger: number;
  isMaximized: boolean;
}

export function MapMobile({ latitude, longitude, refocusTrigger, isMaximized }: MapMobileProps) {
  const { styles } = useStyles(stylesheet);
  const targetCoordinate: [number, number] = [longitude, latitude];
  const cameraRef = useRef<CameraRef>(null);

  useEffect(() => {
    if (cameraRef.current) {
      cameraRef.current.setCamera({
        centerCoordinate: targetCoordinate,
        zoomLevel: 15.5,
        animationDuration: 1000,
      });
    }
  }, []);

  useEffect(() => {
    if (cameraRef.current) {
      cameraRef.current.setCamera({
        centerCoordinate: targetCoordinate,
        zoomLevel: 15.5,
        animationDuration: 1000,
      });
    }
  }, [refocusTrigger]);

  useEffect(() => {
    if (cameraRef.current) {
      cameraRef.current.setCamera({
        centerCoordinate: targetCoordinate,
        zoomLevel: isMaximized ? 16.5 : 15.5,
        animationDuration: 1000,
      });
    }
  }, [isMaximized]);

  return (
    <View style={[styles.mapContainer, isMaximized ? styles.maximized : styles.minimized]}>
      <MapLibreGL.MapView
        style={styles.map}
        logoEnabled={true}
        styleURL="https://api.maptiler.com/maps/streets-v2/style.json?key=qv1nUcyR1uHV9MgBhSuG"
        zoomEnabled={true}
      >
        <MapLibreGL.Camera ref={cameraRef} centerCoordinate={targetCoordinate} zoomLevel={14} />
        <MapLibreGL.PointAnnotation id="targetLocation" coordinate={targetCoordinate}>
          <View style={styles.marker}>
            <View style={styles.markerDot} />
          </View>
        </MapLibreGL.PointAnnotation>
      </MapLibreGL.MapView>
    </View>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  mapContainer: {
    borderRadius: 10,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  minimized: {
    height: 300,
  },
  maximized: {
    height: 620,
  },
  map: {
    flex: 1,
    alignSelf: "stretch",
  },
  marker: {
    width: 24,
    height: 24,
    backgroundColor: theme.ui.colors.primary,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  markerDot: {
    width: 12,
    height: 12,
    backgroundColor: "#fff",
    borderRadius: 6,
  },
}));
