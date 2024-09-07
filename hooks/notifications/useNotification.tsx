import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useLocalSearchParams } from "expo-router";

export type Notification =
  {
    id: string;
    id_usuario: string;
    title: string;
    caption: string;
    kind: string;
    description: string;
    status: string;
    timestamp: string;
    emisor: string;
  }

type NotificationProps = {
  justOne?: boolean;
  isComplete?: boolean;
};

export default function useNotifications({ justOne = false, isComplete = true }: NotificationProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const { notificationId } = useLocalSearchParams<{ notificationId: string }>();

  useEffect(() => {
    const fetchNotifications = async () => {

      const fieldsToSelect = isComplete ? "*" : "id, id_usuario, title, caption, kind, status";

      let query = supabase.from("notifications").select(fieldsToSelect).order('status', { ascending: true });;

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

    fetchNotifications();
  }, []);
  return { notifications, loading };
}
