import { useEffect, useContext, Dispatch, SetStateAction } from "react";
import { supabase } from "@/lib/supabase";
import UsersContext from "@/context/UsersContext";

export default function useUsers() {
  const { setUsers, usersAreLoading, setUsersAreLoading, users } = useContext(UsersContext);

  const fetchUsers = async () => {
    setUsersAreLoading(true);

    const { data, error } = await supabase.from("profiles").select("*");

    if (error) {
      setUsers(null);
      setUsersAreLoading(false);
      throw error;
    }

    setUsers(data);
    setUsersAreLoading(false);
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
