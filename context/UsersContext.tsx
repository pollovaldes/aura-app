import { User } from "@/types/globalTypes";
import { createContext, Dispatch, ReactNode, SetStateAction, useState } from "react";

export interface UsersContextType {
  users: Record<string, User>;
  setUsers: Dispatch<SetStateAction<Record<string, User>>>;
}

export const UsersContext = createContext<UsersContextType>({
  users: {},
  setUsers: () => {},
});

export function UsersContextProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<Record<string, User>>({});

  return <UsersContext.Provider value={{ users, setUsers }}>{children}</UsersContext.Provider>;
}
