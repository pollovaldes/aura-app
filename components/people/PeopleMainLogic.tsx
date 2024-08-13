import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useSession, useSessionContext } from "@/context/SessionContext";

type Person = {
  personId: string;
  full_name: string;
}

export default function PeopleMainLogic() {
  const { isLoading, error } = useSessionContext();
  const session = useSession();
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPeople = async () => {

      if (session) {
        const { data, error } = await supabase
          .from("profiles")
          .select("full_name, personId")

        if (error) {
          console.error(error);
        } else {
          setPeople(data);
        }
        setLoading(false);
      }
    };

    fetchPeople();

    const subscription = supabase
      .channel("public:People")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "UsersTest" },
        (payload) => {
          console.log("Table Person View change:", payload);
          fetchPeople();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [session]);
  return { people, loading };
}