import ProfileContext from "@/context/ProfileContext";
import { useSessionContext } from "@/context/SessionContext";
import { supabase } from "@/lib/supabase";
import { useContext, useEffect } from "react";

export default function useProfile() {
  const { session, isLoading: isSessionLoading } = useSessionContext();
  const { profile, setProfile, isProfileLoading, setIsProfileLoading } = useContext(ProfileContext);

  const fetchProfile = async () => {
    setIsProfileLoading(true);

    if (!session) {
      setProfile(null);
      setIsProfileLoading(false);
      return;
    }

    const { data, error } = await supabase.from("profiles").select("*").eq("id", session.user.id).single();

    if (error) {
      setProfile(null);
      setIsProfileLoading(false);
      throw error;
    }

    setProfile(data);
  };

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
