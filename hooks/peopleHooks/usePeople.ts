import { useEffect, useContext, Dispatch, SetStateAction } from "react";
import { supabase } from "@/lib/supabase";
import { Person } from "@/types/Person";
import PeopleContext from "@/context/PeopleContext";

export default function useVehicle() {
  const { setPeople, peopleAreLoading, setPeopleAreLoading, people } =
    useContext(PeopleContext);

  const fetchPeople = async () => {
    setPeopleAreLoading(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select(
          "id, name, father_last_name, mother_last_name, position, role, is_fully_registered"
        );

      if (!error) {
        const personData = data as Person[];
        setPeople(personData);
        setPeopleAreLoading(false);
      } else {
        console.error("Error from usePeople: ", error);
        setPeople(null);
        setPeopleAreLoading(false);
      }
    } catch (error) {
      console.error("Error fetching profiles: ", error);
      setPeople(null);
    }
  };

  useEffect(() => {
    if (!people) {
      fetchPeople();
    }
  }, []);

  return {
    people,
    peopleAreLoading,
    setPeople,
    fetchPeople,
  };
}
