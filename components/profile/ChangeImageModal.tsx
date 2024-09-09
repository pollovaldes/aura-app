import FormTitle from "@/app/auth/FormTitle";
import { FormButton } from "@/components/Form/FormButton";
import { useSession } from "@/context/SessionContext";
import { supabase } from "@/lib/supabase";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { FileObject } from "@supabase/storage-js";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { decode } from "base64-arraybuffer";

export default function ChangeImageModal({
  closeModal,
}: {
  closeModal: () => void;
}) {
  const { styles } = useStyles(stylesheet);

  return (
    <View style={styles.section}>
      <View style={styles.group}>
        <FormTitle title="Foto de perfil" />
        <Text style={styles.subtitle}>Personaliza tu foto</Text>
      </View>
      <View style={styles.group}>
        <View style={styles.group}>
          <FormButton
            title="Elegir nueva imagen"
            onPress={() => console.log()}
          />
        </View>
        <View style={styles.group}>
          <FormButton
            title="Eliminar foto de perfil"
            onPress={() => console.log()}
          />
        </View>
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
