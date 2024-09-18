import { Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { FormButton } from "@/components/Form/FormButton";
import GroupedList from "@/components/grouped-list/GroupedList";
import Row from "@/components/grouped-list/Row";
import AssignRoleModal from "@/components/Modal/AssignRoleModal";
import Modal from "@/components/Modal/Modal";

type ModalType = "assignRole" | null;

export default function TruckPeopleAdminContainer() {
  const { styles } = useStyles(stylesheet);
  const [modalVisible, setModalVisible] = useState(false);

  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const closeModal = () => {
    setActiveModal(null);
  }
  const openModal = () => {
    setActiveModal("assignRole");
  }

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <View style={styles.container}>
        <Stack.Screen options={{ headerBackTitle: "Info", title: "Cambiar Rol", headerShown: true }} />
        
        <GroupedList header="Rol de usuario">
          <Row
            title="Rol actual"
            trailingType="chevron"
            caption = {"vemos"}// No esta funcionando algo
            showChevron={false}
            disabled={true}
          />
          <Row
            title="Cambiar rol"
            trailingType="chevron"
            showChevron={true}
            onPress={openModal}
          />
        </GroupedList>
        <Modal isOpen={activeModal === "assignRole"}>
          <View style={styles.modalContainer}>
            <Text style={styles.closeButton} onPress={closeModal}>
              Cerrar
            </Text>
            <AssignRoleModal closeModal={closeModal} />
          </View>
        </Modal>
      </View>
    </ScrollView>
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
  modalContainer: {
    width: "100%",
    alignSelf: "center",
    maxWidth: 500,
    backgroundColor: theme.ui.colors.card,
    borderRadius: 10,
    padding: 24,
  },
  modalOption: {
    fontSize: 16,
    marginBottom: 15,
    color: '#007BFF',
  },
  closeButton: {
    color: theme.ui.colors.primary,
    fontSize: 18,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
}));
