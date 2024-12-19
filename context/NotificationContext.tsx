/*
import React, { createContext, useEffect, ReactNode } from 'react';
import * as Notifications from 'expo-notifications';
//import { registerForPushNotificationsAsync } from '@/Services/notifications';

// Define the type for the context value
interface NotificationContextType {
  // Add properties or functions you want to expose
}

// Create the context with an initial value (empty object in this case)
export const NotificationContext = createContext<NotificationContextType>({});

// Define the props for the provider component
interface NotificationProviderProps {
  children: ReactNode;
}

// Create the provider component
const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  useEffect(() => {
    const setupNotifications = async () => {
      //await registerForPushNotificationsAsync();

      // Set a listener for incoming notifications
      const subscription = Notifications.addNotificationReceivedListener(notification => {
        console.log('Notification received:', notification);
      });

      // Cleanup the subscription when the component unmounts
      return () => subscription.remove();
    };

    setupNotifications();
  }, []);

  return (
    <NotificationContext.Provider value={{}}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
*/
