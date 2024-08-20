// ONLY FOR TESTS

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Person = {
  user_Id: number;
  name: string;
  age: number;
}

export function useAddPerson() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [loading, setLoading] = useState(false);

  const resetFields = () => {
    setName("");
    setAge("");
  };

  const handleCreatePerson = async () => {
    
    setLoading(true);
    try {
      const { error } = await supabase.from("UsersTest").insert([
        { name, age: parseInt(age) },
      ]);
      if (error) {
        console.error("Error al crear camión:", error);
      } else {
        resetFields();
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    name,
    age,
    loading,
    setName,
    setAge,
    resetFields,
    handleCreatePerson
  };
}
