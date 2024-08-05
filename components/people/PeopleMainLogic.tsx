import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Person = {
  personId: number;
  name: string;
  age: number;
}

export default function PeopleMainLogic() {
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPeople = async () => {
      const { data, error } = await supabase
        .from("UsersTest")
        .select("*");

      if (error) {
        console.error(error);
      } else {
        setPeople(data);
      }
      setLoading(false);
    };

    fetchPeople();

    const subscription = supabase
      .channel("public:People")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "UsersTest" },
        (payload) => {
          console.log("Table change:", payload);
          fetchPeople();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);
  return { people, loading };
}