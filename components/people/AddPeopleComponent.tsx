// JUST FOR TESTS

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

import { useAddPeople } from "../../hooks/peopleHooks/useAddPeople";

interface AddTruckComponentProps {
  visible: boolean;
  onClose: () => void;
}

function AddPeopleComponent({ visible, onClose }: AddTruckComponentProps) {
  const {
    name,
    age,
    loading,
    setName,
    setAge,
    resetFields,
    handleCreatePerson
  } = useAddPeople();

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
          <Text style={styles.modalTitle}>Crear Nuevo Conductor</Text>
          <TextInput
            placeholder="Nombre"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />
          <TextInput
            placeholder="Edad"
            value={age}
            onChangeText={setAge}
            style={styles.input}
          />

          <Button title="Crear" onPress={handleCreatePerson} disabled={loading} />
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

export default AddPeopleComponent;
