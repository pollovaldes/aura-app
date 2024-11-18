import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useSessionContext } from "@/context/SessionContext";
import { router } from "expo-router";
import { Person } from "@/types/Person";

export default function useProfileWithUUID(UUID: string) {
  const { session, isLoading: isSessionLoading } = useSessionContext();
  const [profileWithUUID, setProfileWithUUID] = useState<Person | null>(null);
  const [isProfileWithUUIDLoading, setIsProfileWithUUIDLoading] =
    useState<boolean>(false);

  const fetchProfileWithUUID = async () => {
    setIsProfileWithUUIDLoading(true);

    try {
      const { data: profileData, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", UUID)
        .single();

      if (profileData) {
        setProfileWithUUID({
          id: profileData.id,
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
      setIsProfileWithUUIDLoading(false);
    }
  };

  useEffect(() => {
    if (!isSessionLoading && session?.user?.id) {
      fetchProfileWithUUID();
    }
  }, []);

  return {
    isProfileWithUUIDLoading,
    profileWithUUID,
    fetchProfileWithUUID,
  };
}
