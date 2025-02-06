import EmptyScreen from "@/components/dataStates/EmptyScreen";
import ErrorScreen from "@/components/dataStates/ErrorScreen";
import { FetchingIndicator } from "@/components/dataStates/FetchingIndicator";
import { useHeaderHeight } from "@react-navigation/elements";
import { useCameraPermissions, CameraView, BarcodeScanningResult } from "expo-camera";
import { Stack } from "expo-router";
import { SwitchCamera, Zap, ZapOff } from "lucide-react-native";
import React, { useRef, useState } from "react";
import { Linking, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { UnistylesRuntime } from "react-native-unistyles";

export function CameraScreen() {
  const { styles } = useStyles(stylesheet);
  const [permission, askPermission] = useCameraPermissions();
  const [isFlashOn, setIsFlashOn] = useState(false);
  const [isFrontFacing, setIsFrontFacing] = useState(false);
  const qrLock = useRef(false);
  const [cameraReady, setCameraReady] = useState(false);

  async function onBarcodeScanned(Barcode: BarcodeScanningResult) {
    qrLock.current = true;
    alert(Barcode.data);
  }

  if (!permission) {
    return <FetchingIndicator caption="Cargando permisos" />;
  }

  if (!permission.granted) {
    return (
      <>
        {permission.canAskAgain ? (
          <EmptyScreen
            retryFunction={async () => {
              askPermission();
            }}
            buttonCaption="Pedir permisos"
            caption="Necesitamos permisos para acceder a la cámara"
          />
        ) : (
          <ErrorScreen
            retryFunction={() => Linking.openSettings()}
            buttonCaption="Abrir configuración"
            caption="No tenemos permisos para acceder a la cámara"
          />
        )}
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: "Agregar persona (QR)" }} />
      <View style={styles.container}>
        <CameraView
          style={styles.camera}
          facing={isFrontFacing ? "front" : "back"}
          enableTorch={isFlashOn ? true : false}
          barcodeScannerSettings={{
            barcodeTypes: ["qr"],
          }}
          onBarcodeScanned={(barcode) => {
            if (barcode && !qrLock.current) {
              onBarcodeScanned(barcode);
            }
            alert(barcode);
            console.log(barcode);
          }}
        />
        <View style={styles.overlay}>
          <View style={styles.topOverlay} />
          <View style={styles.middleRow}>
            <View style={styles.sideOverlay} />
            <View style={styles.hole} />
            <View style={styles.sideOverlay} />
          </View>
          <View style={styles.bottomOverlay} />
        </View>
        <View style={styles.toggleContainer}>
          <View style={styles.toggle}>
            <TouchableOpacity onPress={() => setIsFlashOn(!isFlashOn)}>
              {isFlashOn ? (
                <Zap size={30} color={styles.toggleIconColor.color} />
              ) : (
                <ZapOff size={30} color={styles.toggleIconColor.color} />
              )}
            </TouchableOpacity>
          </View>
          <View style={styles.toggle}>
            <TouchableOpacity onPress={() => setIsFrontFacing(!isFrontFacing)}>
              <SwitchCamera size={30} color={styles.toggleIconColor.color} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
}

const stylesheet = createStyleSheet((theme, runtime) => ({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  camera: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flex: 1,
  },
  topOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  middleRow: {
    height: 280,
    flexDirection: "row",
  },
  sideOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  hole: {
    width: 280,
    height: 280,
    borderWidth: 2,
    borderColor: "white",
    backgroundColor: "transparent",
  },
  bottomOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  toggleContainer: {
    position: "absolute",
    bottom: runtime.screen.height / 13,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: 100,
    alignItems: "center",
  },
  toggle: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 20,
    borderRadius: 100,
  },
  toggleIconColor: {
    color: "white",
  },
  toggleText: {
    color: "white",
    marginRight: 8,
  },
}));
