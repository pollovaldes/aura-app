import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useSessionContext } from "@/context/SessionContext";
import { router } from "expo-router";
import { User } from "@/types/User";

export default function useProfile() {
  const { session, isLoading: isSessionLoading } = useSessionContext();
  const [profile, setProfile] = useState<User | null>(null);
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
          id: profileData.id,
          name: profileData.name,
          father_last_name: profileData.father_last_name,
          mother_last_name: profileData.mother_last_name,
          position: profileData.position,
          role: profileData.role,
          is_fully_registered: profileData.is_fully_registered,
          can_manage_admins: profileData.can_manage_admins,
          can_manage_people: profileData.can_manage_people,
          can_manage_vehicles: profileData.can_manage_vehicles,
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

      // Subscribe to profile updates in real-time
      const profileSubscription = supabase
        .channel("public:profiles")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "profiles",
            filter: `id=eq.${session.user.id}`,
          },
          (payload) => {
            console.log("Change received!", payload);
            router.replace("/");
          }
        )
        .subscribe();

      // Cleanup the subscription when the component unmounts
      return () => {
        supabase.removeChannel(profileSubscription);
      };
    }
  }, [isSessionLoading, session]);

  return {
    isProfileLoading,
    profile,
    fetchProfile,
  };
}
