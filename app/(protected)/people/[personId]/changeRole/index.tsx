import { Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { View, Modal, Text, TouchableOpacity } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { FormButton } from "@/components/Form/FormButton";
import GroupedList from "@/components/grouped-list/GroupedList";
import Row from "@/components/grouped-list/Row";

export default function TruckPeopleAdminContainer() {
  const { styles } = useStyles(stylesheet);
  const [modalVisible, setModalVisible] = useState(false);

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerBackTitle: "Rol", headerTitle: "Cambiar Rol" }} />
      
      <GroupedList header="Rol de usuario">
        <Row
          title="Rol actual"
          trailingType="chevron"
          caption="Placeholder" // Replace with fetched user role
          showChevron={false}
        />
      </GroupedList>
      
      <FormButton
        title="Cambiar rol"
        onPress={handleOpenModal}
        isLoading={false}
        style={styles.button}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Seleccione un nuevo rol</Text>
            
            {/* Example role selection buttons */}
            <TouchableOpacity onPress={() => { /* Handle role selection */ }}>
              <Text style={styles.modalOption}>Admin</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { /* Handle role selection */ }}>
              <Text style={styles.modalOption}>User</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleCloseModal} style={styles.closeButton}>
              <Text style={styles.textStyle}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  container: {
    gap: theme.marginsComponents.section,
    marginTop: theme.marginsComponents.section,
  },
  button: {
    marginLeft: 18,
    marginRight: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: 300,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    color: "black",
  },
  modalOption: {
    fontSize: 16,
    marginBottom: 15,
    color: '#007BFF',
  },
  closeButton: {
    marginTop: 15,
    backgroundColor: theme.components.formComponent.buttonMainBG,
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    color: theme.textPresets.inverted
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
}));
