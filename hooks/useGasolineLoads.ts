import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { GasolineLoad } from '@/types/GasolineLoad';
import { Alert } from 'react-native';
import useProfile from './useProfile';
import profile from '@/app/(protected)/profile';
import ErrorScreen from '@/components/dataStates/ErrorScreen';
import LoadingScreen from '@/components/dataStates/LoadingScreen';


const useGasolineLoads = () => {
    const { profile, isProfileLoading, fetchProfile } = useProfile();
    const role = profile?.role;

    useEffect(() => {
        console.log('Role:', role);
        if (role !== 'ADMIN' && role !== 'OWNER') return;

        const channel = supabase.channel('gasoline_loads')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'gasoline_loads' }, (payload) => {
                console.log(
                    'Nueva Carga de Gasolina',
                    `Se ha registrado una nueva carga de gasolina con un total de ${payload.new.amount} litros.`,
                    [{ text: 'Aceptar' }]
                );
                // Expo Notifications
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [role]);
};

export default useGasolineLoads;
