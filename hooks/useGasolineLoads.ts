import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import useProfile from './useProfile';
import { Alert } from 'react-native';


const useGasolineLoads = () => {
    const { profile, isProfileLoading, fetchProfile } = useProfile();
    const role = profile?.role;

    useEffect(() => {
        console.log('Role:', role);

        const insertGasolineLoad = async () => {
            const { data, error } = await supabase
                .from('notifications')
                .insert([
                    {
                        user_id: profile?.id,
                        content: 'New gasoline load inserted',
                    }]);

            if (error) {
                console.error('Error inserting gasoline load:', error);
                Alert.alert('Error', 'Failed to insert gasoline load');
            } else {
                console.log('Gasoline load inserted:', data);
            }
        };

        const channel = supabase.channel('gasoline_loads')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'gasoline_loads' }, (payload) => {
                // Create supabase notification:
                insertGasolineLoad();

                // Expo Notifications
            })
            .subscribe();


        return () => {
            supabase.removeChannel(channel);
        };
    },[role]);
};

export default useGasolineLoads;
