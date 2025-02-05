import { useCameraPermissions, CameraView } from "expo-camera";
import React, { useState } from "react";
import { StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { UnistylesRuntime } from "react-native-unistyles";

export function CameraScreen() {
  const { styles } = useStyles(stylesheet);
  const [permission] = useCameraPermissions();
  const [isFlashOn, setIsFlashOn] = useState(true);
  const [isFrontFacing, setIsFrontFacing] = useState(true);

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={isFrontFacing ? "front" : "back"}
        enableTorch={isFlashOn ? true : false}
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
          <Text style={styles.toggleText}>Flash</Text>
          <Switch value={isFlashOn} onValueChange={setIsFlashOn} />
        </View>
        <View style={styles.toggle}>
          <Text style={styles.toggleText}>Facing</Text>
          <Switch value={isFrontFacing} onValueChange={setIsFrontFacing} />
        </View>
      </View>
    </View>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  container: {
    flex: 1,
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
    borderRadius: 12,
  },
  bottomOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  toggleContainer: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  toggle: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 10,
    borderRadius: 5,
  },
  toggleText: {
    color: "white",
    marginRight: 8,
  },
}));
