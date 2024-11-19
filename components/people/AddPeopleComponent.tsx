// JUST FOR TESTS
//BORRAR Posiblemente

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
    nombre,
    apellido_paterno,
    apellido_materno,
    email,
    phone,
    password,
    loading,
    setNombre,
    setApellidoPaterno,
    setApellidoMaterno,
    setEmail,
    setPhone,
    setPassword,
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
            value={nombre}
            onChangeText={setNombre}
            style={styles.input}
          />
          <TextInput
            placeholder="Apellido Paterno"
            onChangeText={setApellidoPaterno}
            style={styles.input}
          />
          <TextInput
            placeholder="Apellido Materno"
            value={apellido_materno}
            onChangeText={setApellidoMaterno}
            style={styles.input}
          />
          <TextInput
            placeholder="Telefono"
            value={phone}
            onChangeText={setPhone}
            style={styles.input}
          />
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
          />
          <TextInput
            placeholder="Contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
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
