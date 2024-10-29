import ErrorScreen from '@/components/dataStates/ErrorScreen';
import LoadingScreen from '@/components/dataStates/LoadingScreen';
import Notification from '@/components/Notification/Notification';
import useProfile from '@/hooks/useProfile';
import { supabase } from '@/lib/supabase';
import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

const Notifications = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const { isProfileLoading, profile } = useProfile();
  const { styles } = useStyles(stylesheet);

  useEffect(() => {
    const fetchNotifications = async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', profile?.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.log('Error fetching notifications:', error)
      } else {
        setNotifications(data);
      }
    };

    const channel = supabase.channel('AllChanges')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'notifications' },
        (payload) => {
          fetchNotifications();
          console.log('Notification payload:', payload);
        }
      )
      .subscribe()


    if (profile) {
      fetchNotifications();
    }
    console.log("data", notifications, "profile", profile);

    return () => {
      supabase.removeChannel(channel);
  };
  }, []);

  if (isProfileLoading) {
    return (
      <View style={styles.fullscreenView}>
        <LoadingScreen caption="Cargando sesión" />
      </View>
    );
  }

  // Show error screen if there's an issue with the session or profile
  if (!profile) {
    return (
      <View style={styles.fullscreenView}>
        <ErrorScreen
          caption="Ocurrió un error al recuperar tu sesión o tu perfil"
          buttonCaption="Intentar cerrar sesión"
          retryFunction={() => supabase.auth.signOut()}
        />
      </View>
    );
  }

  const fetchNotifications = async () => {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', profile?.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.log('Error fetching notifications:', error)
    } else {
      setNotifications(data);
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId);

    if (error) {
      console.log('Error deleting notification:', error);
    } else {
      setNotifications((prevNotifications) =>
        prevNotifications.filter((notification) => notification.id !== notificationId)
      );
    }
  };

  return (
    <FlatList
      refreshing={isProfileLoading}
      onRefresh={fetchNotifications}
      contentInsetAdjustmentBehavior='automatic'
      data={notifications}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View
          style={styles.container}
        >
          <Notification
            title={item.content}
            onPressDiscard={() => handleDeleteNotification(item.id)}
            description={item.content}
          ></Notification>
        </View>
      )}
    />
  );
};

export default Notifications;

const stylesheet = createStyleSheet((theme) => ({
  fullscreenView: {
    flex: 1,
    backgroundColor: theme.ui.colors.card,
  },
  container: {
    padding: 10,
  },
  innerContainer: {
    flexDirection: "row",
    width: "85%",
  },
  icon: {
    color: theme.colors.inverted,
  },
}));
