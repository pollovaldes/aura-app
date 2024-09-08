import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/context/SessionContext";

export function useCreateNotification({ id_usuario, title, caption, kind, description }: { id_usuario: string | undefined, title: string, caption: string, kind: string, description: string }) {
  const [loading, setLoading] = useState(false);

  const user = useUser();

  const handleCreateNotification = async () => {
    setLoading(true);
    try {
      console.log(id_usuario, title, caption, kind, description, user?.id);
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
