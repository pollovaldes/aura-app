import { supabase } from "@/lib/supabase";
import { Platform, RefreshControl, ScrollView, Text, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import useProfile from "@/hooks/useProfile";
import { useSessionContext } from "@/context/SessionContext";
import ErrorScreen from "@/components/dataStates/ErrorScreen";
import { FetchingIndicator } from "@/components/dataStates/FetchingIndicator";
import { router, Stack } from "expo-router";
import React, { createElement, useEffect, useState } from "react";
import FormInput from "@/components/Form/FormInput";
import { FormButton } from "@/components/Form/FormButton";
import DatePicker from "react-native-date-picker";
import { differenceInYears, isValid } from "date-fns";

type PersonalData = {
  name: string;
  fatherLastName: string;
  motherLastName: string;
  position: string;
  birthday: Date;
};

function DateTimePickerWeb({
  value,
  onChange,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return createElement("input", {
    type: "date",
    value: value,
    onChange: onChange,
    style: {
      padding: 10,
      fontSize: 16,
      borderRadius: 5,
      border: "1px solid #ccc",
      width: "100%",
    },
  });
}

export default function Index() {
  const { styles } = useStyles(stylesheet);
  const { profile, isProfileLoading, fetchProfile } = useProfile();

  const [name, setName] = useState("");
  const [fatherLastName, setFatherLastName] = useState("");
  const [motherLastName, setMotherLastName] = useState("");
  const [position, setPosition] = useState("");
  const [birthday, setBirthday] = useState(new Date());
  const [isSaving, setIsSaving] = useState(false);

  const [initialState, setInitialState] = useState<PersonalData | null>(null);

  // Function to format date to Mexico City timezone
  const formatToMexicoCityDate = (date: Date): string => {
    const formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/Mexico_City",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    return formatter.format(date); // YYYY-MM-DD format
  };

  const calculateAge = (birthday: Date): string => {
    if (!isValid(birthday)) {
      return "La selección no es válida";
    }
    const age = differenceInYears(new Date(), birthday);
    if (age < 18) {
      return "Debes ser mayor de edad";
    }
    return `Tienes ${age} años`;
  };

  const ageMessage = calculateAge(birthday);

  useEffect(() => {
    if (profile) {
      const [year, month, day] = profile.birthday.split("-").map(Number);
      const birthdayInMexicoCity = new Date(Date.UTC(year, month - 1, day));

      setName(profile.name || "");
      setFatherLastName(profile.father_last_name || "");
      setMotherLastName(profile.mother_last_name || "");
      setPosition(profile.position || "");
      setBirthday(birthdayInMexicoCity);

      setInitialState({
        name: profile.name || "",
        fatherLastName: profile.father_last_name || "",
        motherLastName: profile.mother_last_name || "",
        position: profile.position || "",
        birthday: birthdayInMexicoCity,
      });
    }
  }, [profile]);

  const disabledCondition =
    !initialState ||
    name === "" ||
    fatherLastName === "" ||
    motherLastName === "" ||
    position === "" ||
    !birthday ||
    calculateAge(birthday) !==
      `Tienes ${differenceInYears(new Date(), birthday)} años` ||
    (name === initialState.name &&
      fatherLastName === initialState.fatherLastName &&
      motherLastName === initialState.motherLastName &&
      position === initialState.position &&
      birthday.getTime() === initialState.birthday.getTime());

  if (isProfileLoading) {
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

  const handleSave = async () => {
    setIsSaving(true);

    const { error } = await supabase
      .from("profiles")
      .update({
        name,
        father_last_name: fatherLastName,
        mother_last_name: motherLastName,
        position,
        birthday: formatToMexicoCityDate(birthday),
      })
      .eq("id", profile.id);

    setIsSaving(false);

    if (error) {
      alert("Ocurrió un error al guardar los datos");
      return;
    }

    fetchProfile();

    setTimeout(() => {
      router.replace("/profile");
    }, 300);

    setTimeout(() => {
      router.push("/profile/personal_data");
    }, 600);
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
            refreshing={isProfileLoading}
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
          <View style={styles.dateContainer}>
            <Text style={styles.text}>Fecha de nacimiento</Text>
            <Text style={styles.subtitle}>{ageMessage}</Text>
            {Platform.OS === "web" ? (
              <View style={{ width: 150 }}>
                <DateTimePickerWeb
                  value={formatToMexicoCityDate(birthday)}
                  onChange={(e) => setBirthday(new Date(e.currentTarget.value))}
                />
              </View>
            ) : (
              <DatePicker
                date={birthday}
                onDateChange={setBirthday}
                mode="date"
                locale="mx"
              />
            )}
          </View>

          <FormButton
            title="Guardar datos"
            onPress={handleSave}
            isDisabled={disabledCondition}
            isLoading={isSaving}
          />
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
  dateContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 16,
    gap: 8,
    backgroundColor: theme.textInput.backgroundColor,
    padding: 12,
    borderRadius: 5,
  },
  text: {
    color: theme.textPresets.main,
    fontSize: 22,
    fontWeight: "bold",
  },
  subtitle: {
    color: theme.textPresets.subtitle,
    fontSize: 18,
  },
}));
