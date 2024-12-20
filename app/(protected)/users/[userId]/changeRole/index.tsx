import { Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { FormButton } from "@/components/Form/FormButton";
import GroupedList from "@/components/grouped-list/GroupedList";
import Row from "@/components/grouped-list/Row";
import AssignRoleModal from "@/components/Modal/AssignRoleModal";
import Modal from "@/components/Modal/Modal";
import useUsers from "@/hooks/peopleHooks/useUsers";
import LoadingScreen from "@/components/dataStates/LoadingScreen";
import ErrorScreen from "@/components/dataStates/ErrorScreen";

type ModalType = "assignRole" | null;

export default function TruckPeopleAdminContainer() {
  const { styles } = useStyles(stylesheet);
  const [modalVisible, setModalVisible] = useState(false);

  const { personId } = useLocalSearchParams();
  const { users, usersAreLoading, fetchUsers } = useUsers();

  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const closeModal = () => {
    setActiveModal(null);
  };
  const openModal = () => {
    setActiveModal("assignRole");
  };

  if (usersAreLoading) {
    return <LoadingScreen caption={"Cargando Perfil"}></LoadingScreen>;
  }

  if (!users) {
    return (
      <ErrorScreen
        caption="Error al cargar el perfil"
        buttonCaption="Reintentar"
        retryFunction={fetchUsers}
      />
    );
  }

  const profile = users.find((user) => user.id === personId);

  if (!profile) {
    return (
      <ErrorScreen
        caption="Error al cargar el perfil"
        buttonCaption="Reintentar"
        retryFunction={fetchUsers}
      />
    );
  }

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <View style={styles.container}>
        <Stack.Screen
          options={{
            headerBackTitle: "Info",
            title: "Cambiar Rol",
            headerShown: true,
          }}
        />

        <GroupedList header="Rol de usuario">
          <Row
            title="Rol actual"
            caption={
              profile.role === "OWNER"
                ? "Dueño"
                : profile.role === "ADMIN"
                  ? "Administrador"
                  : profile.role === "DRIVER"
                    ? "Operador"
                    : "No tiene rol"
            }
            hideChevron
            disabled={true}
          />
          <Row title="Cambiar rol" onPress={openModal} />
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
    color: "#007BFF",
  },
  closeButton: {
    color: theme.headerButtons.color,
    fontSize: 18,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
}));
