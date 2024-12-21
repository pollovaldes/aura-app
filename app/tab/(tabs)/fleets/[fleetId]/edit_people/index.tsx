import { FlatList, Platform, Pressable, Text, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import useProfile from "@/hooks/useProfile";
import LoadingScreen from "@/components/dataStates/LoadingScreen";
import ErrorScreen from "@/components/dataStates/ErrorScreen";
import { ChevronRight, Plus } from "lucide-react-native";
import EmptyScreen from "@/components/dataStates/EmptyScreen";
import { Link, Stack, useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { Header, useHeaderHeight } from "@react-navigation/elements";
import UnauthorizedScreen from "@/components/dataStates/UnauthorizedScreen";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import UserThumbnail from "@/components/people/UserThumbnail";
import useUsers from "@/hooks/peopleHooks/useUsers";
import React from "react";
import { useFleets } from "@/hooks/useFleets";
import { SimpleList } from "@/components/simpleList/SimpleList";
import { FormButton } from "@/components/Form/FormButton";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Index() {
  const { styles } = useStyles(stylesheet);
  const { profile, isProfileLoading, fetchProfile } = useProfile();
  const { fleetId } = useLocalSearchParams<{ fleetId: string }>();
  const { areFleetsLoading, fetchFleets, fleets } = useFleets(fleetId);
  const { users, usersAreLoading, fetchUsers } = useUsers();
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();
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

  if (isProfileLoading) {
    return (
      <>
        <Stack.Screen
          options={{
            title: "Cargando",
            headerRight: undefined,
            headerLargeTitle: false,
          }}
        />
        <LoadingScreen caption="Cargando perfil" />
      </>
    );
  }

  if (areFleetsLoading) {
    return (
      <>
        <Stack.Screen
          options={{
            title: "Cargando",
            headerRight: undefined,
            headerLargeTitle: false,
          }}
        />
        <LoadingScreen caption="Cargando flotillas" />
      </>
    );
  }

  if (usersAreLoading) {
    return (
      <>
        <Stack.Screen
          options={{
            title: "Cargando",
            headerRight: undefined,
            headerLargeTitle: false,
          }}
        />
        <LoadingScreen caption="Cargando usuarios" />
      </>
    );
  }

  if (!profile) {
    return (
      <>
        <Stack.Screen
          options={{
            title: "Error",
            headerRight: undefined,
            headerLargeTitle: false,
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
            title: "Error",
            headerRight: undefined,
            headerLargeTitle: false,
          }}
        />
      </>
    );
  }

  if (!users) {
    return (
      <>
        <ErrorScreen
          caption={`Ocurrió un error y no \npudimos cargar los usuarios`}
          buttonCaption="Reintentar"
          retryFunction={fetchUsers}
        />
        <Stack.Screen
          options={{
            title: "Error",
            headerRight: undefined,
            headerLargeTitle: false,
          }}
        />
      </>
    );
  }

  if (fleets.length === 0) {
    return (
      <>
        <UnauthorizedScreen
          caption="No tienes acceso a este recurso"
          buttonCaption="Reintentar"
          retryFunction={fetchFleets}
        />
        <Stack.Screen
          options={{
            title: "Error",
            headerRight: undefined,
            headerLargeTitle: false,
          }}
        />
      </>
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
        refreshing={areFleetsLoading || isProfileLoading}
        onRefresh={() => {
          fetchFleets();
          fetchProfile();
        }}
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
    width: "97%",
    margin: "auto",
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