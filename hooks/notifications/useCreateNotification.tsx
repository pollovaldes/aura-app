import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/context/SessionContext";

type NotificationProps = {
  id_usuario: string | undefined;
  title: string;
  caption: string;
  kind: string;
  description: string;
};

export function useCreateNotification() {
  const [loading, setLoading] = useState(false);

  const user = useUser();

  const handleCreateNotification = async (
    {
      id_usuario,
      title,
      caption,
      kind,
      description
    }: NotificationProps) => {
    setLoading(true);
    try {
      const { error } = await supabase.from("notifications").insert([
        {
          id_usuario,
          title,
          caption,
          kind,
          description,
          emisor: user?.id
        },
      ]);
      if (error) {
        console.error("Error al crear notificacion:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    handleCreateNotification,
  };
}
