import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useSessionContext } from "@/context/SessionContext";
import { Subscription } from "@supabase/supabase-js";

export interface Profile {
  name: string | null;
  father_last_name: string | null;
  mother_last_name: string | null;
  position: string | null;
  role: "NO_ROLE" | "OWNER" | "DRIVER" | "BANNED" | "ADMIN";
  is_fully_registered: boolean | null;
}

export default function useProfile() {
  const { session, isLoading: isSessionLoading } = useSessionContext();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState<boolean>(false);

  const fetchProfile = async () => {
    setIsProfileLoading(true);

    try {
      const { data: profileData, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session?.user.id)
        .single();

      if (profileData) {
        setProfile({
          name: profileData.name,
          father_last_name: profileData.father_last_name,
          mother_last_name: profileData.mother_last_name,
          position: profileData.position,
          role: profileData.role,
          is_fully_registered: profileData.is_fully_registered,
        });
      }
      if (error) throw error;
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setIsProfileLoading(false);
    }
  };

  useEffect(() => {
    if (!isSessionLoading && session?.user?.id) {
      fetchProfile();
    }  
  }, [isSessionLoading, session]);

useEffect(() => {
  const subscription = supabase
    .channel('todos')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'todos' }, () => {
      fetchProfile();
    })
    .subscribe();

  return () => {
    supabase.removeChannel(subscription);
  };
}, []);



return {
  isProfileLoading,
  profile,
  fetchProfile,
};
}
