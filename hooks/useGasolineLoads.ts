import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import useProfile from './useProfile';
import { Alert } from 'react-native';


const useGasolineLoads = () => {
    const { profile, isProfileLoading, fetchProfile } = useProfile();
    const role = profile?.role;

    useEffect(() => {
        console.log('Role:', role);
        const channel = supabase.channel('gasoline_loads')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'gasoline_loads' }, (payload) => {
                if (role !== 'DRIVER'){
                    Alert.alert('Nueva carga de gasolina', 'Se ha registrado una nueva carga de gasolina');
                }
                // Expo Notifications
            })
            .subscribe();


        return () => {
            supabase.removeChannel(channel);
        };
    },[role]);
};

export default useGasolineLoads;
