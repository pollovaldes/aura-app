import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useSessionContext } from "@/context/SessionContext";
import { Person } from "@/types/Person";

export default function useProfilesWithUUIDs(uuids: string[]) {
  const { session, isLoading: isSessionLoading } = useSessionContext();
  const [profiles, setProfiles] = useState<Person[]>([]);
  const [isProfilesLoading, setIsProfilesLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfilesWithUUIDs = async () => {
    setIsProfilesLoading(true);
    setError(null); // Clear previous errors

    try {
      const fetchedProfiles = await Promise.all(
        uuids.map(async (uuid) => {
          const { data: profileData, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", uuid)
            .single();

          if (profileData) {
            return {
              id: profileData.id,
              name: profileData.name,
              father_last_name: profileData.father_last_name,
              mother_last_name: profileData.mother_last_name,
              position: profileData.position,
              role: profileData.role,
              is_fully_registered: profileData.is_fully_registered,
            };
          }
          if (error) {
            setError(
              `Error fetching profile with UUID ${uuid}: ${error.message}`
            );
            return null;
          }
          return null;
        })
      );

      // Filter out any null values (failed fetches)
      setProfiles(
        fetchedProfiles.filter((profile): profile is Person => profile !== null)
      );
    } catch (error) {
      setError(`Error fetching profiles: ${error}`);
    } finally {
      setIsProfilesLoading(false);
    }
  };

  useEffect(() => {
    if (!isSessionLoading && session?.user?.id && uuids.length > 0) {
      fetchProfilesWithUUIDs();
    }
  }, [uuids, isSessionLoading, session?.user?.id]);

  return {
    isProfilesLoading,
    profiles,
    error,
    fetchProfilesWithUUIDs,
  };
}
