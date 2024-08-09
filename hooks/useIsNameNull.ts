import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { useSession, useSessionContext } from "@/context/SessionContext";

export default function useIsNameNull() {
  const { isLoading, error } = useSessionContext();
  const session = useSession();
  const [isNameNull, setIsNameNull] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const hasCheckedProfile = useRef(false);

  useEffect(() => {
    const checkUserProfile = async () => {

      if (session && !hasCheckedProfile.current) {
        hasCheckedProfile.current = true;

        const { data, error } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", session.user.id)
        .single();
        
        if (error) {
          console.error("Error fetching profile", error);
          //setIsProfileLoading(false);       Posiblemente Borrar
          return;
        }
        setIsNameNull(data?.full_name === null);
        //setIsProfileLoading(false);       Posiblemente Borrar
      }
    };

    if (session) {
      checkUserProfile();
    }
  }, [session]);

  return {
    isProfileLoading: isLoading || isProfileLoading,
    isNameNull,
    error,
  };
}