import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/context/SessionContext";

type NotificationProps = {
  notification_id: string;
  status: "read" | "unread";
};

export function useUpdateNotificationStatus() {
  const [loading, setLoading] = useState(false);
  const user = useUser();

  const handleUpdateNotificationStatus = async ({ notification_id, status }: NotificationProps) => {
    if (!user) {
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase
        .from("user_notifications")
        .update({ status })
        .eq("notification_id", notification_id)
        .eq("id_usuario", user?.id);

      if (error) {
        console.error("Error updating notification status:", error);
      } else {
        console.log("Notification status updated successfully");
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    handleUpdateNotificationStatus,
  };
}