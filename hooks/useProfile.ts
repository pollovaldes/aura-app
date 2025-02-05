import ProfileContext from "@/context/ProfileContext";
import { useSessionContext } from "@/context/SessionContext";
import { supabase } from "@/lib/supabase";
import { useContext, useEffect } from "react";

export default function useProfile() {
  const { session } = useSessionContext();
  const { profile, setProfile, isProfileLoading, setIsProfileLoading } = useContext(ProfileContext);

  async function fetchProfile() {
    setIsProfileLoading(true);

    if (!session) {
      setProfile(null);
      setIsProfileLoading(false);
      return;
    }

    const { data, error } = await supabase.from("profile").select("*").eq("id", session.user.id).single();

    if (error) {
      setProfile(null);
      setIsProfileLoading(false);
      throw error;
    }

    setProfile(data);
  }

  useEffect(() => {
    if (!profile) {
      fetchProfile();
    }
  }, [session]);

  useEffect(() => {
    if (profile) {
      setIsProfileLoading(false);
    }
  }, [profile]);

  useEffect(() => {
    if (session) {
      const channel = supabase
        .channel("profile-updates")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "profile", filter: `id=eq.${session.user.id}` },
          (payload) => {
            console.log("Profile change received!", payload);
            fetchProfile();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [session]);

  const getGuaranteedProfile = () => {
    if (!profile) {
      throw new Error("Profile is unexpectedly null. Ensure _layout guards are working correctly.");
    }
    return profile;
  };

  return {
    isProfileLoading,
    profile,
    fetchProfile,
    getGuaranteedProfile,
  };
}
