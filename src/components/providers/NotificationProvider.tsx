'use client';

import { SnackbarProvider } from 'notistack';
import { ReactNode } from 'react';

interface NotificationProviderProps {
  children: ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      autoHideDuration={4000}
      dense
      preventDuplicate
    >
      {children}
    </SnackbarProvider>
  );
} 