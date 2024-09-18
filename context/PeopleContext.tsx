import { Person } from "@/types/People";
import {
  createContext,
  ReactNode,
  useState,
  Dispatch,
  SetStateAction,
} from "react";

interface PeopleContextType {
  people: Person[] | null;
  setPeople: Dispatch<SetStateAction<Person[] | null>>;
  peopleAreLoading: boolean;
  setPeopleAreLoading: Dispatch<SetStateAction<boolean>>;
}

const PeopleContext = createContext<PeopleContextType>({
  people: null,
  setPeople: (() => {}) as Dispatch<SetStateAction<Person[] | null>>,
  peopleAreLoading: true,
  setPeopleAreLoading: (() => {}) as Dispatch<SetStateAction<boolean>>,
});

interface PeopleContextProviderProps {
  children: ReactNode;
}

export function PeopleContextProvider({
  children,
}: PeopleContextProviderProps) {
  const [people, setPeople] = useState<Person[] | null>(null);
  const [peopleAreLoading, setPeopleAreLoading] = useState<boolean>(true);

  return (
    <PeopleContext.Provider
      value={{
        people: people,
        setPeople: setPeople,
        peopleAreLoading: peopleAreLoading,
        setPeopleAreLoading: setPeopleAreLoading,
      }}
    >
      {children}
    </PeopleContext.Provider>
  );
}

export default PeopleContext;
