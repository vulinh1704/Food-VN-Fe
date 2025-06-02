import React, { createContext, useContext } from 'react';
import { useNotificationPortal } from '../components/Supporter/NotificationPortal';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const notificationUtils = useNotificationPortal();

  return (
    <NotificationContext.Provider value={notificationUtils}>
      {children}
      <notificationUtils.NotificationPortal />
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
} 