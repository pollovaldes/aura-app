import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useSessionContext, useUser } from "../context/SessionContext";

export default function useRegistration() {     //Cambiar a useRegistrado
  const {
    isLoading: sessionLoading,
    error: sessionError,
    session,
  } = useSessionContext();
  const [name, setName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [phone, setPhone] = useState<string | null>(null);
  const [registered, setRegistered] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    if (session) {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("nombre, email, phone, registrado")
          .eq("id", session.user.id)
          .single();

        if (error) {
          setError("Error fetching profile");
          console.error("Error fetching profile", error);
        } else {
          setRegistered(data?.registrado || false);
          setName(data?.nombre || null);
          setEmail(data?.email || null);
          setPhone(data?.phone || null);

          if (!data?.email && session.user.email) {
            await supabase
              .from("profiles")
              .update({
                email: session.user.email,
              })
              .eq("id", session.user.id);
              setEmail(session.user.email);
          }

          if (!data?.phone && session.user.phone) {
            await supabase
              .from("profiles")
              .update({
                phone: session.user.phone,
              })
              .eq("id", session.user.id);
              setPhone(session.user.phone);
          }

        }
      } catch (fetchError) {
        setError("An unexpected error occurred while fetching the profile.");
        console.error(fetchError);
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [session]);

  return {
    name,
    email,
    phone,
    registered,
    isLoading: sessionLoading || isLoading,
    error: sessionError || error,
  };
}
