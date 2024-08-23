// AddTruckComponent.tsx

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";

import Modal from "@/components/Modal/Modal";
import { useAddTruck } from "@/components/trucks/AddTruckLogic";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import FormTitle from "@/app/auth/FormTitle";
import { FormButton } from "../Form/FormButton";

interface AddTruckComponentProps {
  visible: boolean;
  onClose: () => void;
}

function AddTruckComponent({ visible, onClose }: AddTruckComponentProps) {

  const { styles } = useStyles(stylesheet);

  const {
    numEco,
    marca,
    submarca,
    modelo,
    serie,
    placa,
    poliza,
    loading,
    setNumEco,
    setMarca,
    setSubmarca,
    setModelo,
    setSerie,
    setPlaca,
    setPoliza,
    handleCreateTruck,
    resetFields,
  } = useAddTruck();

  return (
    <Modal isOpen={visible}>
      <View style={styles.modalContainer}>
        <Text style={styles.closeButton} onPress={onClose}>
          Cerrar
        </Text>

        <View style={styles.section}>
          <View style={styles.group}>
            <FormTitle title="Finaliza tu registro" />
            <Text style={styles.subtitle}>
              Para poder continuar debes terminar de llenar tus datos personales.
            </Text>
            <View style={styles.group}>
              <TextInput
                placeholder="Número económico"
                inputMode="text"
                style={styles.textInput}
                placeholderTextColor={styles.textInput.placehoolderTextColor}
                autoCorrect={false}
                onChangeText={setNumEco}
                />
              <TextInput
                placeholder="Marca"
                inputMode="text"
                style={styles.textInput}
                placeholderTextColor={styles.textInput.placehoolderTextColor}
                autoCorrect={false}
                onChangeText={setMarca}
                />
              <TextInput
                placeholder="Submarca"
                inputMode="text"
                style={styles.textInput}
                placeholderTextColor={styles.textInput.placehoolderTextColor}
                autoCorrect={false}
                onChangeText={setSubmarca}
                />
              <TextInput
                placeholder="Modelo"
                inputMode="text"
                style={styles.textInput}
                placeholderTextColor={styles.textInput.placehoolderTextColor}
                autoCorrect={false}
                onChangeText={setModelo}
                />
              <TextInput
                placeholder="Serie"
                inputMode="text"
                style={styles.textInput}
                placeholderTextColor={styles.textInput.placehoolderTextColor}
                autoCorrect={false}
                onChangeText={setSerie}
                />
              <TextInput
                placeholder="Placa"
                inputMode="text"
                style={styles.textInput}
                placeholderTextColor={styles.textInput.placehoolderTextColor}
                autoCorrect={false}
                onChangeText={setPlaca}
                />
              <TextInput
                placeholder="Póliza"
                inputMode="text"
                style={styles.textInput}
                placeholderTextColor={styles.textInput.placehoolderTextColor}
                autoCorrect={false}
                onChangeText={setPoliza}
                />
              <FormButton
                title="Continuar"
                onPress={handleCreateTruck}
                isLoading={loading}
                />
            </View>
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

export default AddTruckComponent;
