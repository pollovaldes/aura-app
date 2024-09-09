import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  AuthError,
  PostgrestError,
  Session,
  SupabaseClient,
} from "@supabase/supabase-js";

export type SessionContext = {
  isLoading: boolean;
  session: Session | null;
  error: AuthError | PostgrestError | null;
  supabaseClient: SupabaseClient;
  profile: any;
  isAdmin: boolean;
};

const SessionContext = createContext<SessionContext>({
  isLoading: true,
  session: null,
  error: null,
  supabaseClient: {} as SupabaseClient, //any
  profile: null,
  isAdmin: false,
});

export interface SessionContextProviderProps {
  supabaseClient: SupabaseClient;
  initialSession?: Session | null;
}

export const SessionContextProvider = ({
  supabaseClient,
  initialSession = null,
  children,
}: PropsWithChildren<SessionContextProviderProps>) => {
  const [session, setSession] = useState<Session | null>(initialSession);
  const [isLoading, setIsLoading] = useState<boolean>(!initialSession);
  const [error, setError] = useState<AuthError | PostgrestError | null>(null);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (!session && initialSession) {
      setSession(initialSession);
    }
  }, [session, initialSession]);

  useEffect(() => {
    let mounted = true;

    async function getSession() {
      const {
        data: { session },
        error,
      } = await supabaseClient.auth.getSession();

      // only update the react state if the component is still mounted
      if (mounted) {
        if (error) {
          setError(error);
          setIsLoading(false);
          return;
        }

        setSession(session);

        if (session) {
          const { data: profileData, error: profileError } =
            await supabaseClient
              .from("profiles")
              .select("*")
              .eq("id", session.user.id)
              .single();

          if (profileError) {
            setError(profileError);
          } else {
            setProfile(profileData || null);
          }
        }
        setIsLoading(false);
      }
    }

    getSession();

    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((event, session) => {
      setSession(session);

      if (
        session &&
        (event === "SIGNED_IN" ||
          event === "TOKEN_REFRESHED" ||
          event === "USER_UPDATED")
      ) {
        supabaseClient
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single()
          .then(({ data, error }) => {
            if (!error) {
              setProfile(data || null);
            } else {
              setError(error);
            }
          });
      }

      if (event === "SIGNED_OUT") {
        setSession(null);
        setProfile(null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabaseClient]);

  const isAdmin = useMemo(() => profile?.role === "ADMIN", [profile]);

  const value = useMemo(
    () => ({
      isLoading,
      session,
      error,
      supabaseClient,
      profile,
      isAdmin,
    }),
    [isLoading, session, error, supabaseClient, profile, isAdmin]
  );

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
};

export const useSessionContext = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error(
      `useSessionContext must be used within a SessionContextProvider.`
    );
  }

  return context;
};

export function useSupabaseClient<
  Database = any,
  SchemaName extends string & keyof Database = "public" extends keyof Database
    ? "public"
    : string & keyof Database,
>() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error(
      `useSupabaseClient must be used within a SessionContextProvider.`
    );
  }

  return context.supabaseClient as SupabaseClient<Database, SchemaName>;
}

export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error(`useSession must be used within a SessionContextProvider.`);
  }

  return context.session;
};

export const useUser = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error(`useUser must be used within a SessionContextProvider.`);
  }

  return context.session?.user ?? null;
};

export const useAuth = () => {
  const context = useContext(SessionContext);

  return {
    profile: context.profile,
    session: context.session,
    isLoading: context.isLoading,
    isAdmin: context.profile?.roles === "ADMIN",
  };
};
