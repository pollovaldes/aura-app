// components/GasolineThreshold.tsx
import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { GasolineStatus } from "@/hooks/GasolineDataTest/useGasolineStatus";

interface GasolineThresholdProps {
  gasolineStatus: GasolineStatus | null;
  isLoading: boolean;
}

export default function GasolineThreshold({
  gasolineStatus,
  isLoading,
}: GasolineThresholdProps) {
  const { styles } = useStyles(stylesheet);

  if (isLoading) {
    return (
      <View style={styles.thresholdContainer}>
        <ActivityIndicator size="large" color="#1e88e5" />
      </View>
    );
  }

  if (!gasolineStatus) {
    return (
      <View style={styles.thresholdContainer}>
        <Text style={styles.errorText}>No hay datos disponibles</Text>
      </View>
    );
  }

  const progressPercentage =
    (gasolineStatus.spent_gasoline / gasolineStatus.gasoline_threshold) * 100;

  const progressBarColor =
    gasolineStatus.remaining_gasoline <
    gasolineStatus.gasoline_threshold * 0.2
      ? "#f44336"
      : "#4caf50";

  return (
    <View style={styles.thresholdContainer}>
      <Text style={styles.thresholdTitle}>Gasolina Restante</Text>
      <Text style={styles.thresholdValue}>
        ${gasolineStatus.remaining_gasoline.toFixed(2)}{" "}
        <Text style={styles.currency}>MXN</Text>
      </Text>
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${progressPercentage}%`,
                backgroundColor: progressBarColor,
              },
            ]}
          />
        </View>
      </View>
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Límite</Text>
          <Text style={styles.statValue}>
            ${gasolineStatus.gasoline_threshold.toFixed(2)}
          </Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Gastado</Text>
          <Text style={[styles.statValue, { color: "#f44336" }]}>
            ${gasolineStatus.spent_gasoline.toFixed(2)}
          </Text>
        </View>
      </View>
    </View>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  thresholdContainer: {
    padding: 25,
    backgroundColor: theme.ui.colors.card,
    borderRadius: 16,
    alignItems: "center",
    marginVertical: 20,
    width: "95%",
    marginHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  thresholdTitle: {
    fontSize: 18,
    color: theme.textPresets.main,
    fontWeight: "600",
    marginBottom: 10,
  },
  thresholdValue: {
    fontSize: 42,
    color: theme.textPresets.main,
    fontWeight: "bold",
    marginVertical: 15,
  },
  currency: {
    fontSize: 20,
    color: theme.textPresets.subtitle,
    fontWeight: "normal",
  },
  progressContainer: {
    width: "100%",
    marginVertical: 15,
  },
  progressBar: {
    height: 8,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 15,
    paddingHorizontal: 10,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statLabel: {
    fontSize: 14,
    color: theme.textPresets.subtitle,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.textPresets.main,
  },
  statDivider: {
    width: 1,
    backgroundColor: "#e0e0e0",
    marginHorizontal: 15,
  },
  errorText: {
    color: "#f44336",
    fontSize: 16,
    textAlign: "center",
    marginTop: 10,
  },
}));