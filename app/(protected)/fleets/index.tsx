import GroupedList from "@/components/grouped-list/GroupedList";
import Row from "@/components/grouped-list/Row";
import { FlatList, Pressable, Text, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import useProfile from "@/hooks/useProfile";
import LoadingScreen from "@/components/dataStates/LoadingScreen";
import ErrorScreen from "@/components/dataStates/ErrorScreen";
import { Boxes, Plus } from "lucide-react-native";
import { colorPalette } from "@/style/themes";
import useFleets from "@/hooks/useFleets";
import EmptyScreen from "@/components/dataStates/EmptyScreen";
import { Link, router, Stack } from "expo-router";
import { useState } from "react";
import Modal from "@/components/Modal/Modal";
import AddFleetModal from "@/components/fleets/AddFleetModal";

type ModalType = "add_fleet" | null;

export default function Index() {
  const { styles } = useStyles(stylesheet);
  const { profile, isProfileLoading, fetchProfile } = useProfile();
  const { areFleetsLoading, fetchFleets, fleets } = useFleets();
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const closeModal = () => setActiveModal(null);

  if (isProfileLoading) {
    return (
      <>
        <Stack.Screen
          options={{
            headerRight: undefined,
          }}
        />
        <LoadingScreen caption="Cargando perfil" />
      </>
    );
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

  if (areFleetsLoading) {
    return (
      <>
        <Stack.Screen
          options={{
            headerRight: undefined,
          }}
        />
        <LoadingScreen caption="Cargando flotillas" />
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
          headerRight: () =>
            canAddFleet && (
              <Pressable onPress={() => setActiveModal("add_fleet")}>
                <Plus color={styles.plusIcon.color} />
              </Pressable>
            ),
        }}
      />
      {fleets.length === 0 ? (
        <EmptyScreen
          caption="Parece ser que no tienes flotillas asignadas"
          buttonCaption="Reintentar"
          retryFunction={fetchFleets}
        />
      ) : (
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
            <View style={styles.container}>
              <GroupedList>
                <Row
                  title={item.title}
                  onPress={() => {
                    router.navigate(`/fleets/${item.id}`);
                  }}
                  trailingType="chevron"
                  icon={<Boxes size={24} color="white" />}
                  color={colorPalette.cyan[500]}
                />

                <Row
                  trailingType="chevron"
                  disabled
                  title=""
                  onPress={() => {}}
                  showChevron={false}
                >
                  <Text style={styles.description}>{item.description}</Text>
                </Row>
              </GroupedList>
            </View>
          )}
        />
      )}
    </>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  container: {
    gap: theme.marginsComponents.section,
    marginTop: theme.marginsComponents.section, //Excepción
  },
  modalContainer: {
    width: "100%",
    alignSelf: "center",
    maxWidth: 500,
    backgroundColor: theme.ui.colors.card,
    borderRadius: 10,
    padding: 24,
  },
  description: {
    color: theme.textPresets.main,
    fontSize: 16,
  },
  text: {
    color: theme.textPresets.main,
  },
  section: {
    gap: theme.marginsComponents.section,
    alignItems: "center",
  },
  group: {
    gap: theme.marginsComponents.group,
    width: "100%",
  },
  logo: {
    color: theme.colors.inverted,
    width: 180,
    height: 60,
  },
  subtitle: {
    color: theme.textPresets.main,
    textAlign: "center",
  },
  textInput: {
    height: 45,
    borderRadius: 5,
    paddingHorizontal: 12,
    fontSize: 18,
    color: theme.textPresets.main,
    placehoolderTextColor: theme.textPresets.subtitle,
    backgroundColor: theme.textInput.backgroundColor,
  },
  closeButton: {
    color: theme.headerButtons.color,
    fontSize: 18,
    textAlign: "right",
  },
  plusIcon: {
    fontSize: 16,
    color: theme.headerButtons.color,
  },
}));
