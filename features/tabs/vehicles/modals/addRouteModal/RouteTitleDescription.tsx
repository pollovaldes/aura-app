import FormTitle from "@/app/auth/FormTitle";
import { FormButton } from "@/components/Form/FormButton";
import { Text, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import { useCreateRoute } from "./CreateRouteContext";
import FormInput from "@/components/Form/FormInput";
import { useState } from "react";
import { BackButtonOverlay } from "./BackButtonOverlay";

export function RouteTitleDescription() {
  const { styles } = useStyles(stylesheet);
  const { setStep, setField, routeData } = useCreateRoute();
  const [title, setTitle] = useState(routeData.title ? routeData.title : "");
  const [description, setDescription] = useState(routeData.description ? routeData.description : "");

  const mayContinue = title.length > 0 && description.length > 0;

  const onTitleChange = (text: string) => {
    setTitle(text);
    setField("title", text);
  };

  const onDescriptionChange = (text: string) => {
    setDescription(text);
    setField("description", text);
  };

  return (
    <View style={styles.section}>
      <BackButtonOverlay back={() => setStep(0)} />
      <View style={styles.group}>
        <FormTitle title="Dinos un poco más sobre la ruta" />
        <Text style={styles.subtitle}>Ahora agrega un título y descripción a tu ruta </Text>
      </View>
      <View style={styles.group}>
        <FormInput description="Título" onChangeText={(text) => onTitleChange(text)} value={title} />
        <FormInput
          description="Descripción"
          multiline
          onChangeText={(text) => onDescriptionChange(text)}
          value={description}
        />
      </View>
      <View style={styles.group}>
        <FormButton title="Continuar" onPress={() => {}} isDisabled={!mayContinue} />
      </View>
    </View>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  section: {
    gap: theme.marginsComponents.section,
  },
  group: {
    gap: theme.marginsComponents.group,
  },
  subtitle: {
    color: theme.textPresets.subtitle,
    textAlign: "center",
  },
}));
