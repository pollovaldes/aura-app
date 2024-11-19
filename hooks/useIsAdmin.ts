//Este tambien a chingar a su madre
//Borrar


import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { useSession, useSessionContext } from "@/context/SessionContext";

type UserTypes = "admin" | "user"; // Add more roles as needed | "role";

export default function useIsAdmin() {
  const { isLoading, error } = useSessionContext();
  const session = useSession();
  const [isAdmin, setIsAdmin] = useState<UserTypes>();
  const [isAdminLoading, setIsAdminLoading] = useState(true);
  const hasCheckedProfile = useRef(false);

  useEffect(() => {
    const checkUserProfile = async () => {
      if (session && !hasCheckedProfile.current) {
        hasCheckedProfile.current = true;

        const { data, error } = await supabase
          .from("profiles")
          .select("id, role")
          .eq("id", session.user.id)
          .single();

        if (error) {
          console.error("Error fetching profilee", error);
          setIsAdminLoading(false);
          return;
        }

        if (data.role === "ADMIN") {
          setIsAdmin("admin");
        }

        if (data.role === "USER") {
          setIsAdmin("user");
        }

        /* 
        Add more roles as needed
        if (data.roles === ("role")) {
           setIsAdmin("role");
        } 
        */

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
