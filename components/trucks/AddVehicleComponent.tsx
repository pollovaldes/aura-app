import React, { useEffect } from "react";
import { View, Text, TextInput } from "react-native";

import Modal from "@/components/Modal/Modal";
import { useAddVehicle } from "@/hooks/truckHooks/useAddVehicle";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import FormTitle from "@/app/auth/FormTitle";
import { FormButton } from "../Form/FormButton";
import useVehicle from "@/hooks/truckHooks/useVehicle";
import { router } from "expo-router";

interface AddVehicleComponentProps {
  visible: boolean;
  onClose: () => void;
}

function AddVehicleComponent({ visible, onClose }: AddVehicleComponentProps) {
  const { styles } = useStyles(stylesheet);
  const { fetchVehicles } = useVehicle();

  const {
    setBrand,
    setSubBrand,
    setYear,
    setPlate,
    setSerialNumber,
    setEconomicNumber,
    createVehicle,
    vehicle,
    loading,
  } = useAddVehicle();

  useEffect(() => {
    if (vehicle && !loading) {
      onClose();
      fetchVehicles();
      router.navigate(`vehicles/${vehicle.id}`);
    }
  }, [vehicle, loading]);

  return (
    <Modal isOpen={visible}>
      <View style={styles.modalContainer}>
        <Text style={styles.closeButton} onPress={onClose}>
          Cerrar
        </Text>

        <View style={styles.section}>
          <View style={styles.group}>
            <FormTitle title="Registra un nuevo vehículo" />
            <Text style={styles.subtitle}>
              Ingresa los datos del vehículo a continuación
            </Text>
          </View>
          <View style={styles.group}>
            <TextInput
              placeholder="Marca"
              inputMode="text"
              style={styles.textInput}
              placeholderTextColor={styles.textInput.placehoolderTextColor}
              onChangeText={setBrand}
            />
            <TextInput
              placeholder="Submarca"
              inputMode="text"
              style={styles.textInput}
              placeholderTextColor={styles.textInput.placehoolderTextColor}
              onChangeText={setSubBrand}
            />
            <TextInput
              placeholder="Año"
              inputMode="numeric"
              style={styles.textInput}
              placeholderTextColor={styles.textInput.placehoolderTextColor}
              onChangeText={setYear}
            />
            <TextInput
              placeholder="Número de placa"
              inputMode="text"
              style={styles.textInput}
              placeholderTextColor={styles.textInput.placehoolderTextColor}
              autoCorrect={false}
              onChangeText={setPlate}
            />
            <TextInput
              placeholder="Número de serie"
              inputMode="text"
              style={styles.textInput}
              placeholderTextColor={styles.textInput.placehoolderTextColor}
              autoCorrect={false}
              onChangeText={setSerialNumber}
            />
            <TextInput
              placeholder="Número económico"
              inputMode="text"
              style={styles.textInput}
              placeholderTextColor={styles.textInput.placehoolderTextColor}
              autoCorrect={false}
              onChangeText={setEconomicNumber}
            />
          </View>
          <View style={styles.group}>
            <FormButton
              title="Registrar"
              onPress={createVehicle}
              isLoading={loading}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  section: {
    gap: theme.marginsComponents.section,
    alignItems: "center",
  },
  group: {
    gap: theme.marginsComponents.group,
    width: "100%",
  },
  logo: {
    color: theme.colors.inverted,
    width: 180,
    height: 60,
  },
  subtitle: {
    color: theme.textPresets.main,
    textAlign: "center",
  },
  modalContainer: {
    backgroundColor: theme.ui.colors.card,
    borderRadius: 10,
    padding: 24,
  },
  closeButton: {
    color: theme.ui.colors.primary,
    fontSize: 18,
    textAlign: "right",
  },
  textInput: {
    height: 45,
    borderRadius: 5,
    paddingHorizontal: 12,
    fontSize: 18,
    color: theme.textPresets.main,
    placehoolderTextColor: theme.textPresets.subtitle,
    backgroundColor: theme.textInput.backgroundColor,
  },
}));

export default AddVehicleComponent;
