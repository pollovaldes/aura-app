import { Pressable, ScrollView, Text, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import NotificationCard from "@/components/Notification/NotificationCard";
import GroupedList from "@/components/grouped-list/GroupedList";
import { BookUser, Info } from "lucide-react-native";
import { colorPalette } from "@/style/themes";
import Notification from "@/components/Notification/Notification";

export default function Page() {
  const { styles } = useStyles(stylesheet);


  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <View style={styles.container}>

        <Notification
          title="Nuevo Camion"
          caption="Breve descripcion Tambien es una descripcion bien pinches grandote de la notificacion informativa"
          kind="info"
          onPressDiscard={() => { }}
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