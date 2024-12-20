import { Profile } from "@/types/globalTypes";
import { createContext, ReactNode, useState, Dispatch, SetStateAction } from "react";

interface UsersContextType {
  users: Profile[] | null;
  setUsers: Dispatch<SetStateAction<Profile[] | null>>;
  usersAreLoading: boolean;
  setUsersAreLoading: Dispatch<SetStateAction<boolean>>;
}

const UsersContext = createContext<UsersContextType>({
  users: null,
  setUsers: (() => {}) as Dispatch<SetStateAction<Profile[] | null>>,
  usersAreLoading: true,
  setUsersAreLoading: (() => {}) as Dispatch<SetStateAction<boolean>>,
});

interface UsersContextProviderProps {
  children: ReactNode;
}

export function UsersContextProvider({ children }: UsersContextProviderProps) {
  const [users, setUsers] = useState<Profile[] | null>(null);
  const [usersAreLoading, setUsersAreLoading] = useState<boolean>(true);

  return (
    <UsersContext.Provider
      value={{
        users,
        setUsers,
        usersAreLoading,
        setUsersAreLoading,
      }}
    >
      {children}
    </UsersContext.Provider>
  );
}

export default UsersContext;
