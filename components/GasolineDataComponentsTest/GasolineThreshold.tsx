// components/GasolineThreshold.tsx
import React, { useState, useMemo } from "react";
import { View, Text, ActivityIndicator, Pressable, Modal, TextInput } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { GasolineStatus } from "@/hooks/GasolineDataTest/useGasolineStatus";

interface GasolineThresholdProps {
  gasolineStatus: GasolineStatus | null;
  isLoading: boolean;
  canEdit: boolean;
  onUpdateThreshold: (newThreshold: number) => Promise<void>;
}

const ThresholdEditModal = React.memo(({ 
  isVisible, 
  onClose, 
  onSave, 
  initialValue 
}: {
  isVisible: boolean;
  onClose: () => void;
  onSave: (value: number) => Promise<void>;
  initialValue: string;
}) => {
  const { styles } = useStyles(stylesheet);
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSave = async () => {
    const threshold = parseFloat(value);
    if (!isNaN(threshold) && threshold > 0) {
      setIsUpdating(true);
      try {
        await onSave(threshold);
        onClose();
      } catch (err) {
        setError('Error al actualizar el límite');
      } finally {
        setIsUpdating(false);
      }
    } else {
      setError('Ingrese un valor válido mayor a 0');
    }
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Editar Límite de Gasolina</Text>
          <TextInput
            style={styles.input}
            keyboardType="decimal-pad"
            value={value}
            onChangeText={setValue}
            placeholder="Nuevo límite"
          />
          {error && <Text style={styles.errorText}>{error}</Text>}
          {isUpdating && <ActivityIndicator />}
          <View style={styles.modalButtons}>
            <Pressable 
              style={[styles.button, styles.cancelButton]} 
              onPress={onClose}
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
  );
});

export default function GasolineThreshold({
  gasolineStatus,
  isLoading,
  canEdit,
  onUpdateThreshold,
}: GasolineThresholdProps) {
  const { styles } = useStyles(stylesheet);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const {
    progressPercentage,
    progressBarColor,
    formattedRemaining,
    formattedThreshold,
    formattedSpent,
    formattedLiters
  } = useMemo(() => {
    if (!gasolineStatus) return {
      progressPercentage: 0,
      progressBarColor: "#4caf50",
      formattedRemaining: "0.00",
      formattedThreshold: "0.00",
      formattedSpent: "0.00",
      formattedLiters: "0.00"
    };

    const percentage = (gasolineStatus.spent_gasoline / gasolineStatus.gasoline_threshold) * 100;
    const color = gasolineStatus.remaining_gasoline < gasolineStatus.gasoline_threshold * 0.2
      ? "#f44336"
      : "#4caf50";

    return {
      progressPercentage: percentage,
      progressBarColor: color,
      formattedRemaining: gasolineStatus.remaining_gasoline.toFixed(2),
      formattedThreshold: gasolineStatus.gasoline_threshold.toFixed(2),
      formattedSpent: gasolineStatus.spent_gasoline.toFixed(2),
      formattedLiters: gasolineStatus.spent_liters.toFixed(2)
    };
  }, [gasolineStatus]);

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

  return (
    <>
      <Pressable 
        onPress={canEdit ? () => setIsEditModalVisible(true) : undefined}
        style={[styles.thresholdContainer, canEdit && styles.editableBorder]}
      >
        <Text style={styles.thresholdTitle}>Gasolina Restante</Text>
        <Text style={styles.thresholdValue}>
          ${formattedRemaining}{" "}
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
              ${formattedThreshold}
            </Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Gastado</Text>
            <View>
              <Text style={[styles.statValue, { color: "#f44336" }]}>
                ${formattedSpent}
              </Text>
              <Text style={styles.litersValue}>
                {formattedLiters} L
              </Text>
            </View>
          </View>
        </View>
      </Pressable>

      <ThresholdEditModal
        isVisible={isEditModalVisible}
        onClose={() => setIsEditModalVisible(false)}
        onSave={onUpdateThreshold}
        initialValue={gasolineStatus?.gasoline_threshold.toString() || ''}
      />
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