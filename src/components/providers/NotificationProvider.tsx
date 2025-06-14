'use client';

import { SnackbarProvider } from 'notistack';
import { useEffect, useRef } from 'react';
import { useSnackbar } from 'notistack';

function NotificationListener() {
  const { enqueueSnackbar } = useSnackbar();
  const lastNotificationRef = useRef<{ message: string; timestamp: number } | null>(null);

  useEffect(() => {
    const handleNotification = (event: CustomEvent) => {
      if (!event.detail || typeof event.detail !== 'object') {
        return;
      }
      
      const { message, variant } = event.detail;
      
      if (!message || !variant) {
        return;
      }
      
      const now = Date.now();
      
      if (lastNotificationRef.current && 
          lastNotificationRef.current.message === message && 
          now - lastNotificationRef.current.timestamp < 500) {
        return;
      }
      
      lastNotificationRef.current = { message, timestamp: now };
      
      enqueueSnackbar(message, {
        variant,
        autoHideDuration: 3000,
      });
    };

    window.addEventListener('show-notification', handleNotification as EventListener);

    return () => {
      window.removeEventListener('show-notification', handleNotification as EventListener);
    };
  }, [enqueueSnackbar]);

  return null;
}

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  return (
    <SnackbarProvider 
      maxSnack={3}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      dense
    >
      <NotificationListener />
      {children}
    </SnackbarProvider>
  );
} 