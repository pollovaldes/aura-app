import React, { useEffect, useState, useRef } from 'react';
import { Redirect } from 'expo-router';
import { supabase } from '@/lib/supabase';
import LoadingScreen from '@/components/Auth/LoadingScreen';
import { useSession, useSessionContext } from '@/context/SessionContext';
import { Text } from 'react-native';

export default function usePruebas() {
  const { isLoading, error } = useSessionContext();
  const session = useSession();
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [isNameNull, setIsNameNull] = useState(false);
  const hasCheckedProfile = useRef(false);

  useEffect(() => {
    const checkUserProfile = async () => {
      if (session && !hasCheckedProfile.current) {
        hasCheckedProfile.current = true;
        console.log('Checking profile');

        const { data, error } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', session.user.id) // Asegúrate de que "user_id" es el campo correcto en tu base de datos
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
          setIsProfileLoading(false);
          return;
        }

        console.log('Profile data:', data);

        if (data && data.full_name === null) {
          setIsNameNull(true);
        } else {
          setIsNameNull(false);
        }

        setIsProfileLoading(false);
      }
    };

    if (session) {
      checkUserProfile();
    }
  }, [session]);

  if (isLoading || isProfileLoading) {
    console.log('Loading...');
  }

  if (!session) {
    console.log('No session found, redirecting to auth...');
  }

  if (error) {
    console.error('Session context error:', error);
  }

  if (isNameNull) {
    console.log(isNameNull);
  }
  return {
    isProfileLoading,
    isNameNull
  }
};
