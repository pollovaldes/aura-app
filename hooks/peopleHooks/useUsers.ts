import { useContext, useState } from "react";
import { supabase } from "@/lib/supabase";
import { UsersContext } from "@/context/UsersContext";
import { PostgrestError } from "@supabase/supabase-js";

export function useUsers() {
  const { users, setUsers } = useContext(UsersContext);
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [isRefreshingList, setIsRefreshingList] = useState(false);
  const [hasMoreUsers, setHasMoreUsers] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<PostgrestError | null>(null);

  async function fetchUsersPage(page: number = 1, pageSize: number = 5) {
    setError(null);
    if (page === 1) {
      setIsLoadingList(true);
    } else {
      setIsRefreshingList(true);
    }

    const { data, error: fetchError } = await supabase
      .from("profile")
      .select("*")
      .range((page - 1) * pageSize, page * pageSize - 1);

    if (fetchError) {
      setError(fetchError);
      console.error(fetchError);
      throw fetchError;
    }

    if (data) {
      setUsers((prev) => {
        const updatedUsers = { ...prev };
        data.forEach((user) => {
          updatedUsers[user.id] = user;
        });
        return updatedUsers;
      });
      setHasMoreUsers(data.length === pageSize);
      setCurrentPage(page);
    }

    setIsLoadingList(false);
    setIsRefreshingList(false);
  }

  async function refreshUsersList(pageSize: number = 9) {
    setUsers({});
    setCurrentPage(1);
    setHasMoreUsers(true);
    await fetchUsersPage(1, pageSize);
  }

  async function fetchUserById(userId: string) {
    setError(null);
    if (users[userId]) return;

    const { data, error: fetchError } = await supabase.from("profile").select("*").eq("id", userId).single();

    if (fetchError) {
      setError(fetchError);
      console.error(fetchError);
      throw fetchError;
    }

    if (data) {
      setUsers((prev) => ({ ...prev, [data.id]: data }));
    }
  }

  async function refreshUserById(userId: string) {
    setError(null);
    const { data, error: fetchError } = await supabase.from("profile").select("*").eq("id", userId).single();

    if (fetchError) {
      setError(fetchError);
      console.error(fetchError);
      throw fetchError;
    }

    if (data) {
      setUsers((prev) => ({ ...prev, [data.id]: data }));
    }
  }

  async function loadMoreUsers(pageSize: number = 5) {
    if (hasMoreUsers && !isLoadingList && !isRefreshingList) {
      await fetchUsersPage(currentPage + 1, pageSize);
    }
  }

  async function refreshAllUsers() {
    setHasMoreUsers(true);
    await refreshUsersList();
  }

  return {
    users,
    isLoadingList,
    isRefreshingList,
    hasMoreUsers,
    currentPage,
    error,
    fetchUsersPage,
    refreshUsersList,
    fetchUserById,
    refreshUserById,
    loadMoreUsers,
    refreshAllUsers,
  };
}
