import { supabase } from "@/lib/supabase";
import { RefreshControl, ScrollView, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import useProfile from "@/hooks/useProfile";
import { useSessionContext } from "@/context/SessionContext";
import ErrorScreen from "@/components/dataStates/ErrorScreen";
import { FetchingIndicator } from "@/components/dataStates/FetchingIndicator";
import { router, Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import FormInput from "@/components/Form/FormInput";
import { FormButton } from "@/components/Form/FormButton";

type Profile = {
  name: string;
  fatherLastName: string;
  motherLastName: string;
  position: string;
};

export default function Index() {
  const { styles } = useStyles(stylesheet);
  const { session, isLoading: isSessionLoading } = useSessionContext();
  const { profile, isProfileLoading, fetchProfile } = useProfile();

  const [name, setName] = useState("");
  const [fatherLastName, setFatherLastName] = useState("");
  const [motherLastName, setMotherLastName] = useState("");
  const [position, setPosition] = useState("");
  const [role, setRole] = useState("");

  const [isSaving, setIsSaving] = useState(false);

  // Store initial state for comparison
  const [initialState, setInitialState] = useState<Profile | null>(null);

  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setFatherLastName(profile.father_last_name || "");
      setMotherLastName(profile.mother_last_name || "");
      setPosition(profile.position || "");
      setRole(profile.role || "");

      console.log(profile);

      // Set the initial state once profile is loaded
      setInitialState({
        name: profile.name || "",
        fatherLastName: profile.father_last_name || "",
        motherLastName: profile.mother_last_name || "",
        position: profile.position || "",
      });
    }
  }, [profile]);

  // Calculate the disabled condition
  const disabledCondition =
    !initialState || // Disable if the initial state is not set
    name === "" ||
    fatherLastName === "" ||
    motherLastName === "" ||
    position === "" ||
    role === "" ||
    (name === initialState.name &&
      fatherLastName === initialState.fatherLastName &&
      motherLastName === initialState.motherLastName &&
      position === initialState.position);

  if (isProfileLoading || isSessionLoading) {
    return (
      <>
        <Stack.Screen
          options={{
            title: "Cargando",
            headerLargeTitle: false,
            headerRight: undefined,
          }}
        />
        <FetchingIndicator
          caption={isProfileLoading ? "Cargando perfil" : "Cargando sesión"}
        />
      </>
    );
  }

  if (!profile) {
    return (
      <>
        <Stack.Screen
          options={{
            title: "Error",
            headerLargeTitle: false,
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

  if (!session) {
    return (
      <>
        <Stack.Screen
          options={{
            title: "Error",
            headerLargeTitle: false,
            headerRight: undefined,
          }}
        />
        <ErrorScreen
          caption="Ocurrió un error al recuperar tu sesión"
          buttonCaption="Intentar cerrar sesión"
          retryFunction={() => supabase.auth.signOut({ scope: "local" })}
        />
      </>
    );
  }

  const handleSave = async () => {
    setIsSaving(true);

    const { error } = await supabase
      .from("profiles")
      .update({
        name,
        father_last_name: fatherLastName,
        mother_last_name: motherLastName,
        position,
      })
      .eq("id", session.user.id);

    setIsSaving(false);

    if (error) {
      alert("Ocurrió un error al guardar los datos");
    } else {
      fetchProfile();
      setTimeout(() => {
        router.replace("/profile");
        setTimeout(() => {
          router.push("/profile/personal_data");
          setTimeout(() => {
            alert("Datos guardados correctamente");
          }, 500);
        }, 200);
      }, 200);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Datos personales",
          headerLargeTitle: true,
          headerRight: undefined,
        }}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        refreshControl={
          <RefreshControl
            refreshing={isProfileLoading || isSessionLoading}
            onRefresh={fetchProfile}
          />
        }
      >
        <View style={styles.container}>
          <FormInput
            description="Nombre"
            enterKeyHint="done"
            autoComplete="name"
            onChangeText={setName}
            value={name}
          />
          <FormInput
            description="Apellido paterno"
            enterKeyHint="done"
            autoComplete="family-name"
            onChangeText={setFatherLastName}
            value={fatherLastName}
          />
          <FormInput
            description="Apellido materno"
            enterKeyHint="done"
            autoComplete="family-name"
            onChangeText={setMotherLastName}
            value={motherLastName}
          />
          <FormInput
            description="Puesto"
            enterKeyHint="done"
            onChangeText={setPosition}
            value={position}
          />
          <FormButton
            title="Guardar datos"
            onPress={handleSave}
            isDisabled={disabledCondition}
            isLoading={isSaving}
          />
          <View />
        </View>
      </ScrollView>
    </>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  container: {
    gap: theme.marginsComponents.group,
    marginTop: theme.marginsComponents.group,
    padding: 16,
  },
}));
