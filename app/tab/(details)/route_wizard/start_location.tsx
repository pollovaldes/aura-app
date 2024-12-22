import React, { useState, useEffect } from "react";
import * as Location from "expo-location";
import Toast from "react-native-toast-message";
import FormTitle from "@/app/auth/FormTitle";
import { FormButton } from "@/components/Form/FormButton";
import ScrollableFormContainer from "@/features/details/route_wizard/ScrollableFormContainer";
import { router, Stack } from "expo-router";
import { View, StyleSheet, Text } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import WebView from "react-native-webview";
import FormInput from "@/components/Form/FormInput";

interface LocationError {
  type: "permissions" | "other";
  message: string;
}

export default function Index(): JSX.Element {
  const { styles } = useStyles(stylesheet);

  const [latitude, setLatitude] = useState<number | null>(0);
  const [longitude, setLongitude] = useState<number | null>(0);
  const [zoom, setZoom] = useState<number>(2);
  const [isLocationLoading, setIsLocationLoading] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<LocationError | null>(null);
  const [address, setAddress] = useState<string | null>(null);

  const zoomFactor = latitude && longitude ? 0.01 / zoom : 180;
  const mapUrl =
    latitude && longitude
      ? `https://www.openstreetmap.org/export/embed.html?bbox=${longitude - zoomFactor}%2C${latitude - zoomFactor}%2C${longitude + zoomFactor}%2C${latitude + zoomFactor}&layer=carto-dark&marker=${latitude}%2C${longitude}`
      : `https://www.openstreetmap.org/export/embed.html?bbox=-180%2C-90%2C180%2C90&layer=carto-dark`;

  console.log(mapUrl);

  const showToast = (title: string, caption: string) => {
    Toast.show({
      type: "alert",
      text1: title,
      text2: caption,
    });
  };

  const getAddressFromCoordinates = async (lat: number, lon: number): Promise<void> => {
    try {
      const [location] = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lon });
      const formattedAddress =
        `${location.street || ""} ${location.streetNumber || ""}, col. ${location.subregion || ""}, ${location.city || location.region || ""}, ${location.region || ""}, México. C. P. ${location.postalCode || ""}`.trim();
      setAddress(formattedAddress);
      showToast(
        "Dirección inferida",
        "Se ha inferido una dirección basada en tu ubicación. Puedes modificarla si es necesario."
      );
    } catch (error) {
      console.error("Error fetching address:", error);
      setAddress("No se pudo obtener la dirección.");
    }
  };

  const getLocation = async (): Promise<void> => {
    setIsLocationLoading(true);
    setLocationError(null);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLocationError({ type: "permissions", message: "No tenemos permiso para acceder a tu ubicación." });
        setIsLocationLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setLatitude(location.coords.latitude);
      setLongitude(location.coords.longitude);
      setZoom(10);
      await getAddressFromCoordinates(location.coords.latitude, location.coords.longitude);
      setIsLocationLoading(false);
    } catch (error: unknown) {
      setLocationError({ type: "other", message: "No pudimos obtener tu ubicación." });
      setIsLocationLoading(false);
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  const isContinueDisabled = !address || !latitude || !longitude;

  return (
    <>
      <Stack.Screen
        options={{
          title: "Punto de partida",
        }}
      />
      <ScrollableFormContainer>
        <View style={styles.section}>
          <View style={styles.group}>
            <FormTitle title="¿En dónde vas a empezar?" />
          </View>
          <View style={styles.group}>
            <FormInput
              multiline
              description="Dirección"
              value={address || ""}
              onChangeText={(text) => {
                setAddress(text);
              }}
            />
          </View>
          <View style={styles.group}>
            <View style={styles.captionContainer}>
              {isLocationLoading ? (
                <Text style={styles.subtitle}>Estamos obteniendo tu ubicación actual en el mapa.</Text>
              ) : locationError ? (
                <Text style={styles.subtitle}>{locationError.message}</Text>
              ) : (
                <Text style={styles.subtitle}>Tu ubicación actual</Text>
              )}
            </View>

            <View style={styles.webviewContainer}>
              <WebView
                source={{ uri: mapUrl }}
                style={styles.webview}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                scalesPageToFit={true}
              />
              <View style={styles.overlay} />
            </View>
            <FormButton
              title={locationError ? "Intentar obtener ubicación nuevamente" : "Obtener ubicación de nuevo"}
              isLoading={isLocationLoading}
              onPress={() => {
                getLocation();
              }}
            />
          </View>
          <View style={styles.group}>
            <FormButton
              title="Continuar"
              onPress={() => router.push("./title_description")}
              isDisabled={isContinueDisabled}
            />
          </View>
        </View>
      </ScrollableFormContainer>
    </>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  section: {
    gap: theme.marginsComponents.section,
  },
  group: {
    gap: theme.marginsComponents.group,
  },
  subtitle: {
    color: theme.textPresets.main,
    textAlign: "center",
    fontSize: 16,
  },
  captionContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  webviewContainer: {
    height: 320,
    overflow: "hidden",
    borderRadius: 8,
    position: "relative",
  },
  webview: {
    height: 300,
    borderRadius: 8,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "transparent",
    zIndex: 1,
  },
}));
