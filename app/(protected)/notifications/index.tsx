import { Pressable, ScrollView, Text, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import Notification from "@/components/grouped-list/Notification";
import GroupedList from "@/components/grouped-list/GroupedList";
import { BookUser, Info } from "lucide-react-native";
import { colorPalette } from "@/style/themes";

export default function Page() {
  const { styles } = useStyles(stylesheet);


  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <View style={styles.container}>

        <Notification
          title="informacion"
          onPress={() => { }}
          caption="Breve descripcion de la notificacion informativa"
          kind="info"
        />
        <Notification
          title="Aprobado"
          onPress={() => { }}
          caption="Mensajes buenos, aprovaciones, confirmaciones"
          kind="good"
        />
        <Notification
          title="Rechazado"
          onPress={() => { }}
          caption="Mensajes malos, rechazos, errores"
          kind="bad"
        />
        <Notification
          title="Aviso"
          onPress={() => { }}
          caption="Mensajes importantes, advertencias, avisos"
          kind="message"
        />

      </View>
    </ScrollView>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  container: {
    gap: theme.marginsComponents.section,
    marginTop: theme.marginsComponents.section, //Excepción

  },
  group: {
    gap: theme.marginsComponents.group,
    width: "100%",
  },
}));