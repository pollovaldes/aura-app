import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useSession, useSessionContext } from "@/context/SessionContext";
import { useLocalSearchParams } from "expo-router";

type Person = {
  id: string;
  name: string;
  father_last_name: string;
  mother_last_name: string;
  position?: string;
  role?: string;
  is_full_registered?: boolean;
};

type PersonProps = {
  justOne?: boolean;
  isComplete?: boolean;
};

export default function usePeople({
  justOne = false,
  isComplete = true,
}: PersonProps) {
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const { personId } = useLocalSearchParams<{ personId: string }>();

  useEffect(() => {
    const fetchPeople = async () => {
      const fieldsToSelect = isComplete
        ? "*"
        : "id, name, father_last_name, mother_last_name";

      let query = supabase
        .from("profiles")
        .select(fieldsToSelect)
        .order("name", { ascending: true });

      if (justOne && personId) {
        query = query.eq("id", personId);
      }

      const { data, error } = await query;

      if (error) {
        console.error(error);
      } else {
        setPeople(data as unknown as Person[]); // Si algun día checas esto arturo, soluciona, funciona pero no se por que tengo que poner el unkown
      }
      setLoading(false);
    };

    fetchPeople();
  }, []);

  return { people, loading };
}
