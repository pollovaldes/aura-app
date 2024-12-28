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
import { Plus, RotateCw } from "lucide-react-native";
import React, { useState } from "react";
import { FlatList, Platform, Text, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

type ModalType = "add_fleet" | null;

export default function FleetsList() {
  const { styles } = useStyles(stylesheet);
  const { getGuaranteedProfile } = useProfile();
  const profile = getGuaranteedProfile();
  const { areFleetsLoading, fetchFleets, fleets } = useFleets();
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const closeModal = () => setActiveModal(null);

  if (areFleetsLoading) {
    return <FetchingIndicator caption={"Cargando flotillas"} />;
  }

  if (!fleets) {
    return (
      <ErrorScreen
        caption="Ocurrió un error al recuperar las flotillas."
        buttonCaption="Reintentar"
        retryFunction={fetchFleets}
      />
    );
  }

  const canAddFleet = profile.role === "ADMIN" || profile.role === "OWNER";

  return (
    <>
      <Modal isOpen={activeModal === "add_fleet"} close={closeModal}>
        <AddFleetModal closeModal={closeModal} fetchFleets={fetchFleets} />
      </Modal>

      <Stack.Screen
        options={{
          title: "Flotillas",
          headerRight: () => (
            <ActionButtonGroup>
              <ActionButton
                onPress={() => setActiveModal("add_fleet")}
                Icon={Plus}
                show={canAddFleet}
                text="Crear flotilla"
              />
              <ActionButton onPress={fetchFleets} Icon={RotateCw} text="Actualizar" show={Platform.OS === "web"} />
            </ActionButtonGroup>
          ),
        }}
      />

      <FlatList
        contentInsetAdjustmentBehavior="automatic"
        data={fleets}
        keyExtractor={(item) => item.id}
        refreshing={areFleetsLoading}
        onRefresh={fetchFleets}
        renderItem={({ item }) => (
          <SimpleList
            relativeToDirectory
            href={`./${item.id}`}
            content={
              <View style={{ flexDirection: "column" }}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemSubtitle}>{item.description}</Text>
              </View>
            }
          />
        )}
        ListEmptyComponent={<EmptyScreen caption="Ninguna flotilla por aquí." />}
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
