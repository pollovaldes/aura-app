import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { useSession, useSessionContext } from "@/context/SessionContext";

export default function useIsAdmin() {
  const { isLoading, error } = useSessionContext();
  const session = useSession();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdminLoading, setIsAdminLoading] = useState(true);
  const hasCheckedProfile = useRef(false);

  useEffect(() => {
    const checkUserProfile = async () => {
      if (session && !hasCheckedProfile.current) {
        hasCheckedProfile.current = true;

        const { data, error } = await supabase
        .from("profiles")
        .select("roles")
        .eq("id", session.user.id)
        .single();
        
        if (error) {
          console.error("Error fetching profile", error);
          setIsAdminLoading(false);
          return;
        }

        if (data.roles === ("admin")) {
          setIsAdmin(true);
        }
        
        setIsAdminLoading(false);
      }
    };

    if (session) {
      checkUserProfile();
    }
  }, [session]);

  return {
    isAdminLoading: isLoading || isAdminLoading,
    isAdmin,
    error,
  };
}