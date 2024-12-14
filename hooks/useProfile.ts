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
    const { data: profileData, error } = await supabase
      .from("profiles")
      .select(
        "id, name, father_last_name, mother_last_name, position, role, is_fully_registered"
      )
      .eq("id", session?.user.id)
      .single();

    if (profileData) {
      setProfile(profileData as User);
    }

    setIsProfileLoading(false);

    if (error) throw error;
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
  }, [session, isSessionLoading]);

  return {
    isProfileLoading,
    profile,
    fetchProfile,
  };
}
