import React, { useEffect, useRef } from "react";
import { View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { Map, Marker, MapRef } from "@vis.gl/react-maplibre";
import "maplibre-gl/dist/maplibre-gl.css";

interface UniversalMapProps {
  latitude: number;
  longitude: number;
  refocusTrigger: number;
  isMaximized: boolean;
}

export function UniversalMap({ latitude, longitude, refocusTrigger, isMaximized }: UniversalMapProps) {
  const { styles } = useStyles(stylesheet);
  const mapRef = useRef<MapRef | null>(null);

  useEffect(() => {
    if (mapRef.current) {
      const mapInstance = mapRef.current.getMap();
      mapInstance.easeTo({
        zoom: isMaximized ? 16.5 : 15.5,
        duration: 1000,
      });
    }
  }, [isMaximized]);

  useEffect(() => {
    if (mapRef.current) {
      const mapInstance = mapRef.current.getMap();
      mapInstance.easeTo({
        center: [longitude, latitude],
        zoom: 15.5,
        duration: 1000,
      });
    }
  }, [refocusTrigger]);

  return (
    <View style={[styles.mapContainer, isMaximized ? styles.maximized : styles.minimized]}>
      <Map
        ref={mapRef}
        initialViewState={{
          longitude,
          latitude,
          zoom: isMaximized ? 16.5 : 15.5,
          bearing: 0,
          pitch: 0,
          padding: { top: 0, bottom: 0, left: 0, right: 0 },
        }}
        style={styles.map}
        mapStyle="https://api.maptiler.com/maps/streets-v2/style.json?key=qv1nUcyR1uHV9MgBhSuG"
      >
        <Marker longitude={longitude} latitude={latitude} anchor="bottom">
          <View style={styles.marker}>
            <View style={styles.markerDot} />
          </View>
        </Marker>
      </Map>
    </View>
  );
}

const stylesheet = createStyleSheet((theme, runtime) => ({
  mapContainer: {
    borderRadius: 10,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    position: "relative",
  },
  minimized: {
    height: "100%",
    minHeight: runtime.screen.height / 5,
  },
  maximized: {
    height: "100%",
    minHeight: runtime.screen.height / 1.5,
  },
  map: {
    flex: 1,
    width: "100%",
    height: "100%",
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
