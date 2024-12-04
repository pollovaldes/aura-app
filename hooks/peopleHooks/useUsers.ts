import { useEffect, useContext, Dispatch, SetStateAction } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@/types/User";
import UsersContext from "@/context/UsersContext";

export default function useUsers() {
  const { setUsers, usersAreLoading, setUsersAreLoading, users } =
    useContext(UsersContext);

  const fetchUsers = async () => {
    setUsersAreLoading(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select(
          "id, name, father_last_name, mother_last_name, position, role, is_fully_registered, can_manage_admins, can_manage_people, can_manage_vehicles"
        );

      if (!error) {
        const userData = data as User[];
        setUsers(userData);
        setUsersAreLoading(false);
      } else {
        console.error("Error from useUsers: ", error);
        setUsers(null);
        setUsersAreLoading(false);
      }
    } catch (error) {
      console.error("Error fetching profiles: ", error);
      setUsers(null);
    }
  };

  useEffect(() => {
    if (!users) {
      fetchUsers();
    }
  }, []);

  return {
    users,
    usersAreLoading,
    setUsers,
    fetchUsers,
  };
}
