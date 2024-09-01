// Borrar, ningun usuaruio deberia poder agregar personas, ademas es un pdo con el admin/auth y supabase

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export function useAddPeople() {
  const [nombre, setNombre] = useState("");
  const [apellido_paterno, setApellidoPaterno] = useState("");
  const [apellido_materno, setApellidoMaterno] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const resetFields = () => {
    setNombre("");
    setApellidoPaterno("");
    setApellidoMaterno("");
    setEmail("");
    setPhone("");
    setPassword("");
  };

  const handleCreatePerson = async () => {
    setLoading(true);
    try {

      const { data: userData, error: authError } = await supabase.auth.admin.createUser({
        email,
        password,
        phone,
        email_confirm: true,
      });

      if (authError) {
        console.error("Error al crear usuario:", authError);
        return;
      }

      const { error: profilleError } = await supabase
        .from("profiles")
        .update({ 
          nombre, 
          apellido_paterno, 
          apellido_materno, 
          email, 
          phone 
        })
        .eq("id", userData.user.id)
        .single();


      if (profilleError) {
        console.error("Error al crear perfil:", profilleError);
      } else {
        resetFields();
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    nombre,
    apellido_paterno,
    apellido_materno,
    email,
    phone,
    password,
    loading,
    setNombre,
    setApellidoPaterno,
    setApellidoMaterno,
    setEmail,
    setPhone,
    setPassword,
    resetFields,
    handleCreatePerson
  };
}
