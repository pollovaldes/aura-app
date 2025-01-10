import React, { useState, useEffect } from "react";
import * as Location from "expo-location";
import Toast from "react-native-toast-message";
import FormTitle from "@/app/auth/FormTitle";
import { FormButton } from "@/components/Form/FormButton";
import { View, Text, Platform } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import FormInput from "@/components/Form/FormInput";
import { BackButtonOverlay } from "./BackButtonOverlay";
import { useCreateRoute } from "./CreateRouteContext";
import { UniversalMap as UniversalMapNative } from "@/features/global/components/UniversalMap.native";
import { UniversalMap as UniversalMapWeb } from "@/features/global/components/UniversalMap.web";
import { ActionButtonGroup } from "@/components/actionButton/ActionButtonGroup";
import { ActionButton } from "@/components/actionButton/ActionButton";
import { Locate, Maximize2, Minimize2 } from "lucide-react-native";

interface LocationError {
  type: "permissions" | "other";
  message: string;
}

export function StartLocation() {
  const { styles } = useStyles(stylesheet);
  const { setStep, setField, routeData } = useCreateRoute();

  const [latitude, setLatitude] = useState<number | null>(19.419444444444);
  const [longitude, setLongitude] = useState<number | null>(-99.145555555556);
  const [isLocationLoading, setIsLocationLoading] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<LocationError | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [refocusTrigger, setRefocusTrigger] = useState(0);
  const [isMaximized, setIsMaximized] = useState(false);

  function handleRefocus() {
    setRefocusTrigger((prev) => prev + 1);
  }

  function handleMaximize() {
    setIsMaximized((prev) => !prev);
  }

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
      setField("started_address", formattedAddress);
      showToast(
        "Dirección inferida",
        "Se ha inferido una dirección basada en tu ubicación. Puedes modificarla si es necesario."
      );
    } catch (error) {
      console.error("Error fetching address:", error);
      setAddress("No se pudo obtener la dirección.");
      setField("started_address", "No se pudo obtener la dirección.");
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
      setField("started_location_longitude", location.coords.longitude);
      setField("started_location_latitude", location.coords.latitude);
      handleRefocus();
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
    <View style={styles.section}>
      <BackButtonOverlay back={() => setStep(1)} />
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
            <>
              <Text style={styles.subtitle}>Tu ubicación actual</Text>
              <ActionButtonGroup>
                <ActionButton text="Centrar" Icon={Locate} onPress={handleRefocus} />
                <ActionButton
                  text={isMaximized ? "Minimizar" : "Maximizar"}
                  Icon={isMaximized ? Minimize2 : Maximize2}
                  onPress={handleMaximize}
                />
              </ActionButtonGroup>
            </>
          )}
        </View>

        <View style={{ flex: 1 }}>
          {Platform.OS !== "web" ? (
            <UniversalMapNative
              latitude={latitude as number}
              longitude={longitude as number}
              refocusTrigger={refocusTrigger}
              isMaximized={isMaximized}
            />
          ) : (
            <UniversalMapWeb
              latitude={latitude as number}
              longitude={longitude as number}
              refocusTrigger={refocusTrigger}
              isMaximized={isMaximized}
            />
          )}
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
        <FormButton title="Continuar" onPress={() => setStep(3)} isDisabled={isContinueDisabled} />
      </View>
    </View>
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
}));
