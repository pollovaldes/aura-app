import { useSessionContext } from "@/context/SessionContext";
import { supabase } from "@/lib/supabase";
import { Profile } from "@/types/globalTypes";
import { router } from "expo-router";
import { useEffect, useState } from "react";

export default function useProfile() {
  const { session, isLoading: sessionIsLoading } = useSessionContext(); // Use session context
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState<boolean>(false);

  const fetchProfile = async () => {
    if (!session || !session.user) {
      setProfile(null);
      return;
    }

    setIsProfileLoading(true);

    const { data, error } = await supabase.from("profiles").select("*").eq("id", session.user.id).single();

    if (error) {
      console.error("Error fetching profile:", error);
      setProfile(null);
      setIsProfileLoading(false);
      return;
    }

    setProfile(data);

    setIsProfileLoading(false);
  };

  useEffect(() => {
    if (sessionIsLoading) {
      return;
    }

    if (!session || !session.user) {
      console.error("No session or user found");
      setProfile(null);
      return;
    }

    fetchProfile();

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
          console.log("Profile change received:", payload);
          router.replace("/");
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(profileSubscription);
    };
  }, [session, sessionIsLoading]);

  return {
    isProfileLoading,
    profile,
    fetchProfile,
  };
}
