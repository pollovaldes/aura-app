// AddTruckComponent.tsx

import React from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  Button,
  StyleSheet,
} from "react-native";
import { useAddTruck } from "@/components/trucks/AddTruckLogic";

interface AddTruckComponentProps {
  visible: boolean;
  onClose: () => void;
}

function AddTruckComponent({ visible, onClose }: AddTruckComponentProps) {
  const {
    marca,
    submarca,
    modelo,
    loading,
    setMarca,
    setSubmarca,
    setModelo,
    handleCreateTruck,
    resetFields,
  } = useAddTruck();

  const handleCancel = () => {
    resetFields();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleCancel}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Crear Nuevo Camión</Text>
          <TextInput
            placeholder="Marca"
            value={marca}
            onChangeText={setMarca}
            style={styles.input}
          />
          <TextInput
            placeholder="Submarca"
            value={submarca}
            onChangeText={setSubmarca}
            style={styles.input}
          />
          <TextInput
            placeholder="Modelo"
            value={modelo}
            onChangeText={setModelo}
            keyboardType="numeric"
            style={styles.input}
          />
          <Button title="Crear" onPress={handleCreateTruck} disabled={loading} />
          <Button title="Cancelar" onPress={handleCancel} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 15,
  },
  input: {
    width: "100%",
    borderBottomWidth: 1,
    borderColor: "gray",
    marginBottom: 10,
    padding: 8,
  },
});

export default AddTruckComponent;
