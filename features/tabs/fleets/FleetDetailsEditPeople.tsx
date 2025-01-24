import { FlatList, Text, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import useProfile from "@/hooks/useProfile";
import ErrorScreen from "@/components/dataStates/ErrorScreen";
import EmptyScreen from "@/components/dataStates/EmptyScreen";
import { Stack, useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import UnauthorizedScreen from "@/components/dataStates/UnauthorizedScreen";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import UserThumbnail from "@/components/people/UserThumbnail";
import useUsers from "@/hooks/peopleHooks/useUsers";
import React from "react";
import { useFleets } from "@/hooks/useFleets";
import { SimpleList } from "@/components/simpleList/SimpleList";
import { FormButton } from "@/components/Form/FormButton";
import { FetchingIndicator } from "@/components/dataStates/FetchingIndicator";

export default function FleetDetailsEditPeople() {
  const { styles } = useStyles(stylesheet);
  const { getGuaranteedProfile } = useProfile();
  const profile = getGuaranteedProfile();
  const { fleetId } = useLocalSearchParams<{ fleetId: string }>();
  const { areFleetsLoading, fetchFleets, fleets } = useFleets(fleetId);
  const { users, usersAreLoading, fetchUsers } = useUsers();
  const [currentTabIndex, setCurrentTabIndex] = useState(0);

  const capitalizeWords = (text: string | null | undefined): string => {
    if (!text) return "";
    return text
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ presentation: "modal" });
  }, [navigation]);

  if (areFleetsLoading || usersAreLoading) {
    <FetchingIndicator caption={areFleetsLoading ? "Cargando flotillas" : "Cargando usuarios"} />;
  }

  if (!fleets) {
    return (
      <ErrorScreen
        caption="Ocurrió un error al recuperar las flotillas"
        buttonCaption="Reintentar"
        retryFunction={fetchFleets}
      />
    );
  }

  if (!users) {
    return (
      <ErrorScreen
        caption={`Ocurrió un error y no \npudimos cargar los usuarios`}
        buttonCaption="Reintentar"
        retryFunction={fetchUsers}
      />
    );
  }

  if (fleets.length === 0) {
    return (
      <UnauthorizedScreen
        caption="No tienes acceso a este recurso"
        buttonCaption="Reintentar"
        retryFunction={fetchFleets}
      />
    );
  }

  const canAddFleet = profile.role === "ADMIN" || profile.role === "OWNER";

  const fleet = fleets[0];

  return (
    <>
      <Stack.Screen
        options={{
          title: "Administrar personas",
          headerLargeTitle: false,
          headerSearchBarOptions: {
            placeholder: "Buscar",
            hideWhenScrolling: true,
          },
        }}
      />

      <FlatList
        contentInsetAdjustmentBehavior="automatic"
        data={currentTabIndex === 0 ? fleet.users : users}
        keyExtractor={(item) => item.id}
        refreshing={areFleetsLoading}
        onRefresh={fetchFleets}
        style={{ marginBottom: 36 }}
        renderItem={({ item }) => (
          <SimpleList
            hideChevron
            leading={<UserThumbnail userId={item.id.toString()} size={60} />}
            content={
              <Text style={styles.listText}>
                {`${capitalizeWords(item.name)} ${capitalizeWords(item.father_last_name)} ${capitalizeWords(item.mother_last_name)}`}
              </Text>
            }
            trailing={
              <FormButton
                title="Eliminar"
                buttonType="danger"
                onPress={() => {
                  console.log("Eliminar");
                }}
              />
            }
          />
        )}
        ListEmptyComponent={
          <View style={{ marginTop: 100 }}>
            <EmptyScreen caption="Esta flotilla no tiene personas" />
          </View>
        }
        ListHeaderComponent={
          <SegmentedControl
            values={["Personas en esta flotilla", "Todas las personas"]}
            selectedIndex={currentTabIndex}
            onChange={(event) => setCurrentTabIndex(event.nativeEvent.selectedSegmentIndex)}
            style={styles.segmentedControl}
          />
        }
      />
    </>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  listContainer: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: theme.ui.colors.border,
  },
  container: {
    gap: theme.marginsComponents.section,
    marginTop: theme.marginsComponents.section,
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  imageContainer: {
    padding: 12,
  },
  chevron: {
    color: theme.textPresets.subtitle,
  },
  chevronView: {
    paddingRight: 12,
  },
  itemText: {
    fontSize: 18,
    paddingLeft: 10,
    color: theme.textPresets.main,
    flexShrink: 1,
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
  segmentedControl: {
    width: "98.5%",
    marginHorizontal: "auto",
    marginVertical: 6,
  },
  listText: {
    fontSize: 18,
    paddingLeft: 10,
    color: theme.textPresets.main,
    flexShrink: 1,
    marginRight: 18,
  },
  buttonIcon: {
    color: theme.textPresets.inverted,
  },
}));
