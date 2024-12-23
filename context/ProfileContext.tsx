import { User } from "@/types/globalTypes";
import { createContext, Dispatch, ReactNode, SetStateAction, useState } from "react";

interface ProfileContextType {
  profile: User | null;
  setProfile: Dispatch<SetStateAction<User | null>>;
  isProfileLoading: boolean;
  setIsProfileLoading: Dispatch<SetStateAction<boolean>>;
}

const ProfileContext = createContext<ProfileContextType>({
  profile: null,
  setProfile: (() => {}) as Dispatch<SetStateAction<User | null>>,
  isProfileLoading: false,
  setIsProfileLoading: (() => {}) as Dispatch<SetStateAction<boolean>>,
});

interface ProfileContextProviderProps {
  children: ReactNode;
}

export function ProfileContextProvider({ children }: ProfileContextProviderProps) {
  const [profile, setProfile] = useState<User | null>(null);
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
