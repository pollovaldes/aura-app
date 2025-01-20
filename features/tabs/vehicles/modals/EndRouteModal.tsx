import React, { useState, useEffect } from "react";
import * as Location from "expo-location";
import Toast from "react-native-toast-message";
import FormTitle from "@/app/auth/FormTitle";
import { FormButton } from "@/components/Form/FormButton";
import { View, Text, Platform } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import FormInput from "@/components/Form/FormInput";
import { UniversalMap as UniversalMapNative } from "@/features/global/components/UniversalMap.native";
import { UniversalMap as UniversalMapWeb } from "@/features/global/components/UniversalMap.web";
import { ActionButtonGroup } from "@/components/actionButton/ActionButtonGroup";
import { ActionButton } from "@/components/actionButton/ActionButton";
import { Locate, MapPinHouse, Maximize2, Minimize2 } from "lucide-react-native";
import { useCreateRoute } from "./addRouteModal/CreateRouteContext";
import { Route } from "@/types/globalTypes";
import { useActiveRoute } from "@/features/routePage/hooks/useActiveRoute";
import { router } from "expo-router";

interface LocationError {
  type: "permissions" | "other";
  message: string;
}

interface EndRouteModalProps {
  close: () => void;
  activeRoute: Route;
}

export function EndRouteModal({ close, activeRoute }: EndRouteModalProps) {
  const { styles } = useStyles(stylesheet);
  const [latitude, setLatitude] = useState(19.419444444444);
  const [longitude, setLongitude] = useState(-99.145555555556);
  const [isLocationLoading, setIsLocationLoading] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<LocationError | null>(null);
  const [address, setAddress] = useState("");
  const [refocusTrigger, setRefocusTrigger] = useState(0);
  const [isMaximized, setIsMaximized] = useState(false);
  const [routeUpdatingInProgress, setRouteUpdatingInProgress] = useState(false);
  const { endRoute, error } = useActiveRoute("");

  async function finishRoute() {
    setRouteUpdatingInProgress(true);
    await endRoute(activeRoute.id, address, latitude, longitude);
    setRouteUpdatingInProgress(false);

    if (error) {
      alert("No se pudo finalizar la ruta: " + error.message);
      return;
    }

    close();
  }

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

  const onAdressChange = (text: string) => {
    setAddress(text);
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
      handleRefocus();
      setIsLocationLoading(false);
    } catch (error: unknown) {
      setLocationError({ type: "other", message: "No pudimos obtener tu ubicación." });
      setIsLocationLoading(false);
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  const isContinueDisabled =
    !address ||
    latitude === 19.419444444444 ||
    longitude === -99.145555555556 ||
    address.includes("No se pudo obtener la dirección");

  return (
    <View style={styles.section}>
      <View style={styles.group}>
        <FormTitle title="Finalizar ruta" />
      </View>
      <View style={styles.group}>
        <View style={{ alignSelf: "center" }}>
          <ActionButtonGroup>
            <ActionButton
              text="Obtener dirección"
              Icon={MapPinHouse}
              onPress={() => getAddressFromCoordinates(latitude as number, longitude as number)}
              preventCollapsing
            />
          </ActionButtonGroup>
        </View>
        <FormInput
          multiline
          description="Dirección de finalización de la ruta"
          onChangeText={(text) => onAdressChange(text)}
          value={address}
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
                <ActionButton text="Centrar" Icon={Locate} onPress={handleRefocus} preventCollapsing />
                <ActionButton
                  text={isMaximized ? "Minimizar" : "Maximizar"}
                  Icon={isMaximized ? Minimize2 : Maximize2}
                  onPress={handleMaximize}
                  preventCollapsing
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
        <FormButton
          title="Finalizar"
          onPress={finishRoute}
          isDisabled={isContinueDisabled}
          buttonType="danger"
          isLoading={routeUpdatingInProgress}
        />
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