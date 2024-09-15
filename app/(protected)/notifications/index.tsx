import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import NotificationCard from "@/components/Notification/NotificationCard";
import GroupedList from "@/components/grouped-list/GroupedList";
import { BookUser, ChevronRight, Info, Link } from "lucide-react-native";
import { colorPalette } from "@/style/themes";
import Notification from "@/components/Notification/Notification";

export default function Page() {
  const { styles } = useStyles(stylesheet);

  return <></>;
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
}));
