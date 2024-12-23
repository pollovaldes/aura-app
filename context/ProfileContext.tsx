import { Profile } from "@/types/globalTypes";
import { createContext, Dispatch, ReactNode, SetStateAction, useState } from "react";

interface ProfileContextType {
  profile: Profile | null;
  setProfile: Dispatch<SetStateAction<Profile | null>>;
  isProfileLoading: boolean;
  setIsProfileLoading: Dispatch<SetStateAction<boolean>>;
}

const ProfileContext = createContext<ProfileContextType>({
  profile: null,
  setProfile: (() => {}) as Dispatch<SetStateAction<Profile | null>>,
  isProfileLoading: false,
  setIsProfileLoading: (() => {}) as Dispatch<SetStateAction<boolean>>,
});

interface ProfileContextProviderProps {
  children: ReactNode;
}

export function ProfileContextProvider({ children }: ProfileContextProviderProps) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState<boolean>(false);

  return (
    <ProfileContext.Provider
      value={{
        profile,
        setProfile,
        isProfileLoading,
        setIsProfileLoading,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export default ProfileContext;
