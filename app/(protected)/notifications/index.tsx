import { ActivityIndicator, Alert, FlatList, Pressable, ScrollView, Text, View } from "react-native";
import { createStyleSheet, useStyles } from "react-native-unistyles";
import NotificationCard from "@/components/Notification/NotificationCard";
import GroupedList from "@/components/grouped-list/GroupedList";
import { BookUser, ChevronRight, Info, Link } from "lucide-react-native";
import { colorPalette } from "@/style/themes";
import Notification from "@/components/Notification/Notification";
import useNotifications from "@/hooks/notifications/useNotification";
import { useUpdateNotificationStatus } from "@/hooks/notifications/useUpdateNotificationStatus";

export default function Page() {
  const { styles } = useStyles(stylesheet);
  const { notifications, loading } = useNotifications({ justOne: false, isComplete: true });
  const { handleUpdateNotificationStatus, loading: updateLoading } = useUpdateNotificationStatus();

  const markAsRead = async (notificationId : string) => {
    await handleUpdateNotificationStatus({notification_id : notificationId, status : "read"});
    Alert.alert("Rawr");
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
        <FlatList
          contentInsetAdjustmentBehavior="automatic"
          data={notifications}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => {
            console.log("this ", item);
            return (
              <View style={styles.container}>
                <View>
                  <Notification
                    title={item.title}
                    caption={item.caption}
                    kind={item.kind as any}
                    onPressDiscard={() => markAsRead(item.id)}
                    description={item.description}
                    status={/*item.user_notifications === []? "unread" : item.user_notifications[0].status*/"unread"}
                  />
                </View>
              </View>
            );
          }}
        />
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
}));