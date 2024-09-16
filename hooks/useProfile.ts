import { useSession, useSessionContext } from "@/context/SessionContext";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

export type ProfileRoles = "NO_ROLE" | "OWNER" | "DRIVER" | "BANNED" | "ADMIN";

export default function useProfile() {
  const [name, setName] = useState<string | null>(null);
  const [fatherLastName, setFatherLastName] = useState<string | null>(null);
  const [motherLastName, setMotherLastName] = useState<string | null>(null);
  const [position, setPosition] = useState<string | null>(null);
  //const [birthdate, setBirthdate] = useState(null); //TIME //TODO
  const [role, setRole] = useState<ProfileRoles>("NO_ROLE");
  const [isFullyRegistered, setIsFullyRegistered] = useState<boolean | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { session, isLoading: isSessionLoading } = useSessionContext();

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      let { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session?.user.id)
        .single();
      if (profile) {
        setName(profile.name);
        setFatherLastName(profile.father_last_name);
        setMotherLastName(profile.mother_last_name);
        setRole(profile.role);
        setIsFullyRegistered(profile.is_fully_registered);
        setPosition(profile.position);
      }
      if (error) throw error;
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching profile:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch profile data when the session is ready and not loading
    if (!isSessionLoading && session?.user?.id) {
      fetchProfile();
    }
  }, [isSessionLoading, session]);

  return {
    isLoading,
    name,
    fatherLastName,
    motherLastName,
    role,
    isFullyRegistered,
    position,
  };
}
