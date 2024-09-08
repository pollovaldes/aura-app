import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useLocalSearchParams } from "expo-router";
import { useUser } from "@/context/SessionContext";

export type Notification =
  {
    id: string;
    id_usuario: string;
    title: string;
    caption: string;
    kind: string;
    description: string;
    timestamp: string;
    emisor: string;
    user_notifications: any;
  }

type NotificationProps = {
  justOne?: boolean;
  isComplete?: boolean;
};

export default function useNotifications({ justOne = false, isComplete = true }: NotificationProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const { notificationId } = useLocalSearchParams<{ notificationId: string }>();
  const user = useUser();


  useEffect(() => {
    const fetchNotifications = async () => {

      const fieldsToSelect = isComplete
        ? "*, user_notifications(status)"
        : "id, id_usuario, title, caption, kind, user_notifications(status)";

      let query = supabase
        .from("notifications")
        .select(fieldsToSelect)
        .order('title', { ascending: true });

      if (justOne && notificationId) {
        query = query.eq("id", notificationId);
      }

      const { data, error } = await query

      if (error) {
        console.error(error);
      } else {
        setNotifications(data as unknown as Notification[]); // Si algun día checas esto arturo, soluciona, funciona pero no se por que tengo que poner el unkown 
      }
      setLoading(false);
    };

    if (user) {
      fetchNotifications();
    }
  }, [user, notificationId, justOne, isComplete]);
  return { notifications, loading };
}
