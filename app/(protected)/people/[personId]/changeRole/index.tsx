import { Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { FormButton } from "@/components/Form/FormButton";
import GroupedList from "@/components/grouped-list/GroupedList";
import Row from "@/components/grouped-list/Row";
import AssignRoleModal from "@/components/people/AssignRoleModal";
import Modal from "@/components/Modal/Modal";

type ModalType = "assignrole" | null;

export default function TruckPeopleAdminContainer() {
  const { styles } = useStyles(stylesheet);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const closeModal = () => setActiveModal(null);
  const openModal = () => setActiveModal("assignrole");

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
        onPress = {openModal}
        isLoading={false}
        style={styles.button}
      />
      <Modal isOpen={activeModal === "assignrole"}>
        <View style={styles.modalContainer}>
          <Text style={styles.closeButton} onPress={closeModal}>
            Cerrar
          </Text>
          <AssignRoleModal closeModal={closeModal} />
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
    textAlign: "right",
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
}));
