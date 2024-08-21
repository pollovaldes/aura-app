// The Logic of the PeopleAdmin Component

import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Alert, Text, TextInput, View } from "react-native";
import FormTitle from "@/app/auth/FormTitle";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { FormButton } from "@/components/Form/FormButton";

export default function TruckPeopleAdminContainer() {
  const { styles } = useStyles(stylesheet);
  const { personId } = useLocalSearchParams<{ personId: string }>();
  const [role, setRole] = useState(""); // Define the type of state
  const [loading, setLoading] = useState(true);
  
  const fetchTruckData = async () => {
    if (personId) {
      try {
        const { data, error } = await supabase
        .from("profiles")
        .select("roles")
        .eq("id", personId)
        .single();
        
        if (error) throw error;
        if (data === null) {
          setRole(data);
        }
        
        console.log(role);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    }
  };

  const changeRole = async () => {
    setLoading(true);
    if (personId) {
      const { data, error } = await supabase
        .from("profiles")
        .update({
          roles: role,
        })
        .eq("id", personId)
        .single();

      if (error) {
        Alert.alert("Error", error.message);
        setLoading(false);
        return;
      }

      Alert.alert("Éxito", "Rol actualizado");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (personId) {
      fetchTruckData();
    }
  }, [personId]);

  return (
    <View style={styles.section}>
      <View style={styles.group}>
        <FormTitle title="Cambia el Rol" />
        <Text style={styles.subtitle}>
          Solo los admin pueden cambiar el rol. Solo existe "ADMIN"
        </Text>
      </View>
      <View style={styles.group}>
        <TextInput
          placeholder="rol"
          inputMode="text"
          style={styles.textInput}
          placeholderTextColor={styles.textInput.placehoolderTextColor}
          autoCorrect={false}
          onChangeText={setRole}
        />
        <FormButton
          title="Continuar"
          onPress={changeRole}
          isLoading={loading}
        />
      </View>
    </View>
  );
}


const stylesheet = createStyleSheet((theme) => ({
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
}));
