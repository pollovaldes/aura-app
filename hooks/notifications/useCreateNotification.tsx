import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/context/SessionContext";

export function useCreateNotification() {
  const [id_usuario, setIdUsuario] = useState<string | undefined>(undefined);
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [kind, setKind] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const user = useUser();

  const resetFields = () => {
    setIdUsuario("");
    setTitle("");
    setCaption("");
    setKind("");
    setDescription("");
  };

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
      } else {
        resetFields();
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    setIdUsuario,
    setTitle,
    setCaption,
    setKind,
    setDescription,
    loading,
    handleCreateNotification,
    resetFields,
  };
}
