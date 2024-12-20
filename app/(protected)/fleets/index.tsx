import Modal from "@/components/Modal/Modal";
import { ActionButton } from "@/components/actionButton/ActionButton";
import { ActionButtonGroup } from "@/components/actionButton/ActionButtonGroup";
import EmptyScreen from "@/components/dataStates/EmptyScreen";
import ErrorScreen from "@/components/dataStates/ErrorScreen";
import { FetchingIndicator } from "@/components/dataStates/FetchingIndicator";
import AddFleetModal from "@/components/fleets/AddFleetModal";
import { SimpleList } from "@/components/simpleList/SimpleList";
import { useFleets } from "@/hooks/useFleets";
import useProfile from "@/hooks/useProfile";
import { Stack } from "expo-router";
import { ChevronRight, Plus } from "lucide-react-native";
import React, { useState } from "react";
import { FlatList, Text, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";

type ModalType = "add_fleet" | null;

export default function Index() {
  const { styles } = useStyles(stylesheet);
  const { profile, isProfileLoading, fetchProfile } = useProfile();
  const { areFleetsLoading, fetchFleets, fleets } = useFleets();
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const closeModal = () => setActiveModal(null);

  if (isProfileLoading || areFleetsLoading) {
    return <FetchingIndicator caption={isProfileLoading ? "Cargando perfil" : "Cargando flotillas"} />;
  }

  if (!profile) {
    return (
      <>
        <Stack.Screen
          options={{
            headerRight: undefined,
          }}
        />
        <ErrorScreen
          caption="Ocurrió un error al recuperar tu perfil"
          buttonCaption="Reintentar"
          retryFunction={fetchProfile}
        />
      </>
    );
  }

  if (!fleets) {
    return (
      <>
        <ErrorScreen
          caption="Ocurrió un error al recuperar las flotillas"
          buttonCaption="Reintentar"
          retryFunction={fetchFleets}
        />
        <Stack.Screen
          options={{
            headerRight: undefined,
          }}
        />
      </>
    );
  }

  const canAddFleet = profile.role === "ADMIN" || profile.role === "OWNER";

  return (
    <>
      <Modal isOpen={activeModal === "add_fleet"}>
        <View style={styles.modalContainer}>
          <Text style={styles.closeButton} onPress={closeModal}>
            Cerrar
          </Text>
          <AddFleetModal closeModal={closeModal} fetchFleets={fetchFleets} />
        </View>
      </Modal>

      <Stack.Screen
        options={{
          headerSearchBarOptions: {
            placeholder: "Buscar flotilla",
            hideWhenScrolling: false,
          },
          headerRight: () => (
            <ActionButtonGroup>
              <ActionButton Icon={Plus} onPress={() => setActiveModal("add_fleet")} show={canAddFleet} />
            </ActionButtonGroup>
          ),
        }}
      />

      <FlatList
        contentInsetAdjustmentBehavior="automatic"
        data={fleets}
        keyExtractor={(item) => item.id}
        refreshing={areFleetsLoading || isProfileLoading}
        onRefresh={() => {
          fetchFleets();
          fetchProfile();
        }}
        renderItem={({ item }) => (
          <SimpleList
            href={`/fleets/${item.id}`}
            content={
              <View style={{ flexDirection: "column" }}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemSubtitle}>{item.description}</Text>
              </View>
            }
          />
        )}
        ListEmptyComponent={<EmptyScreen caption="Parece ser que no tienes flotillas asignadas" />}
      />
    </>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  modalContainer: {
    width: "100%",
    alignSelf: "center",
    maxWidth: 500,
    backgroundColor: theme.ui.colors.card,
    borderRadius: 10,
    padding: 24,
  },
  closeButton: {
    color: theme.headerButtons.color,
    fontSize: 18,
    textAlign: "right",
  },
  listItem: {
    flexDirection: "column",
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.textPresets.main,
  },
  itemSubtitle: {
    fontSize: 15,
    color: theme.textPresets.subtitle,
  },
}));
