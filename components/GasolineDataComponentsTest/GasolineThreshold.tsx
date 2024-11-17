// components/GasolineThreshold.tsx
import React, { useState } from "react";
import { View, Text, ActivityIndicator, Pressable, Modal, TextInput } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { GasolineStatus } from "@/hooks/GasolineDataTest/useGasolineStatus";

interface GasolineThresholdProps {
  gasolineStatus: GasolineStatus | null;
  isLoading: boolean;
  canEdit: boolean;
  onUpdateThreshold: (newThreshold: number) => Promise<void>;
}

export default function GasolineThreshold({
  gasolineStatus,
  isLoading,
  canEdit,
  onUpdateThreshold,
}: GasolineThresholdProps) {
  const { styles } = useStyles(stylesheet);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [newThreshold, setNewThreshold] = useState('');

  const handlePress = () => {
    if (canEdit) {
      setNewThreshold(gasolineStatus?.gasoline_threshold.toString() || '');
      setIsEditModalVisible(true);
    }
  };

  const handleSave = async () => {
    const threshold = parseFloat(newThreshold);
    if (!isNaN(threshold) && threshold > 0) {
      await onUpdateThreshold(threshold);
      setIsEditModalVisible(false);
    }
  };

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
    <>
      <Pressable 
        onPress={handlePress}
        style={[styles.thresholdContainer, canEdit && styles.editableBorder]}
      >
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
            <View>
              <Text style={[styles.statValue, { color: "#f44336" }]}>
                ${gasolineStatus.spent_gasoline.toFixed(2)}
              </Text>
              <Text style={styles.litersValue}>
                {gasolineStatus.spent_liters.toFixed(2)} L
              </Text>
            </View>
          </View>
        </View>
      </Pressable>

      <Modal
        visible={isEditModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Límite de Gasolina</Text>
            <TextInput
              style={styles.input}
              keyboardType="decimal-pad"
              value={newThreshold}
              onChangeText={setNewThreshold}
              placeholder="Nuevo límite"
            />
            <View style={styles.modalButtons}>
              <Pressable 
                style={[styles.button, styles.cancelButton]} 
                onPress={() => setIsEditModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </Pressable>
              <Pressable 
                style={[styles.button, styles.saveButton]} 
                onPress={handleSave}
              >
                <Text style={styles.buttonText}>Guardar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
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
  litersValue: {
    fontSize: 14,
    color: theme.textPresets.subtitle,
    textAlign: 'center',
    marginTop: 2,
  },
  editableBorder: {
    borderWidth: 1,
    borderColor: theme.headerButtons.color,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: theme.ui.colors.card,
    padding: 20,
    borderRadius: 16,
    width: '90%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.textPresets.main,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    color: theme.textPresets.main,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#e0e0e0',
  },
  saveButton: {
    backgroundColor: theme.headerButtons.color,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
  },
}));