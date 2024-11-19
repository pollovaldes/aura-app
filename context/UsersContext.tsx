import { User } from "@/types/User";
import {
  createContext,
  ReactNode,
  useState,
  Dispatch,
  SetStateAction,
} from "react";

interface UsersContextType {
  users: User[] | null;
  setUsers: Dispatch<SetStateAction<User[] | null>>;
  usersAreLoading: boolean;
  setUsersAreLoading: Dispatch<SetStateAction<boolean>>;
}

const UsersContext = createContext<UsersContextType>({
  users: null,
  setUsers: (() => {}) as Dispatch<SetStateAction<User[] | null>>,
  usersAreLoading: true,
  setUsersAreLoading: (() => {}) as Dispatch<SetStateAction<boolean>>,
});

interface UsersContextProviderProps {
  children: ReactNode;
}

export function UsersContextProvider({
  children,
}: UsersContextProviderProps) {
  const [users, setUsers] = useState<User[] | null>(null);
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
