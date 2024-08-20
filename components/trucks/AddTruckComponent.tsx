// AddTruckComponent.tsx

import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  Button,
  StyleSheet,
  FlatList,
  TouchableOpacity,
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
    selectedDriver,
    drivers,
    loading,
    setMarca,
    setSubmarca,
    setModelo,
    setSelectedDriver,
    handleCreateTruck,
    resetFields,
  } = useAddTruck();

  const [dropdownVisible, setDropdownVisible] = useState(false);

  const handleCancel = () => {
    resetFields();
    onClose();
  };

  const handleDriverSelect = (driver: any) => {
    setSelectedDriver(driver);
    setDropdownVisible(false);
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

          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setDropdownVisible(!dropdownVisible)}
          >
            <Text style={styles.dropdownText}>
              {selectedDriver ? selectedDriver.name : "Seleccionar conductor"}
            </Text>
          </TouchableOpacity>

          {dropdownVisible && (
            <FlatList
              data={drivers}
              keyExtractor={(item) => item.user_Id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => handleDriverSelect(item)}
                >
                  <Text>{item.name}</Text>
                </TouchableOpacity>
              )}
              style={styles.dropdownList}
            />
          )}

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

  label: {
    alignSelf: "flex-start",
    marginBottom: 5,
    fontSize: 16,
  },
  dropdown: {
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderColor: "gray",
    marginBottom: 10,
  },
  dropdownText: {
    fontSize: 16,
  },
  dropdownList: {
    width: "100%",
    maxHeight: 150,
    borderWidth: 1,
    borderColor: "gray",
    marginBottom: 10,
    backgroundColor: "white",
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "gray",
  },
});

export default AddTruckComponent;
