import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useSessionContext } from "../context/SessionContext";

export default function useUserName() {
  const {
    isLoading: sessionLoading,
    error: sessionError,
    session,
  } = useSessionContext();
  const [name, setName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserNames = async () => {
    if (session) {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", session.user.id)
          .single();

        if (error) {
          setError("Error fetching profile");
          console.error("Error fetching profile", error);
        } else {
          setName(data?.full_name?.trim() || null);
        }
      } catch (fetchError) {
        setError("An unexpected error occurred while fetching the profile.");
        console.error(fetchError);
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserNames();
  }, [session]);

  return {
    name: name,
    isLoading: sessionLoading || isLoading,
    error: sessionError || error,
  };
}
