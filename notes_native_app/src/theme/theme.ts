import React, { PropsWithChildren } from 'react';
import { Platform } from 'react-native';

export const themeColors = {
  primary: '#2563EB',
  secondary: '#F59E0B',
  success: '#F59E0B',
  error: '#EF4444',
  background: '#f9fafb',
  surface: '#ffffff',
  text: '#111827',
  muted: '#6B7280',
  shadow: '#0f172a1a'
};

export const spacing = (n: number) => n * 4;

export const cardStyle = {
  backgroundColor: themeColors.surface,
  borderRadius: 12,
  padding: spacing(4),
  ...Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8
    },
    android: {
      elevation: 2
    },
    default: {}
  })
};

export const OceanTheme = ({ children }: PropsWithChildren<{}>) => {
  // Simple wrapper for future theming context if needed
  return <>{children}</>;
};
