/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#000000',
    background: '#ffffff',
    backgroundElement: '#F0F0F3',
    backgroundSelected: '#E0E1E6',
    textSecondary: '#60646C',
    
    primary: '#208AEF',
    onPrimary: '#FFFFFF',
    primaryContainer: '#D6ECFC',
    onPrimaryContainer: '#0A5FA8',
    primaryMuted: '#A0CFEE',
    
    secondaryYellow: '#FFC107',
    onSecondaryYellow: '#000000',
    secondaryYellowContainer: '#FFF3CD',
    onSecondaryYellowContainer: '#7A5800',
    secondaryYellowMuted: '#FFD966',
    
    success: '#22C55E',
    onSuccess: '#052E16',
    successContainer: '#DCFCE7',
    onSuccessContainer: '#15803D',
    successMuted: '#86EFAC',
    
    info: '#3B82F6',
    onInfo: '#EFF6FF',
    infoContainer: '#DBEAFE',
    onInfoContainer: '#1D4ED8',
    infoMuted: '#93C5FD',
    
    warning: '#F59E0B',
    onWarning: '#1C0A00',
    warningContainer: '#FEF3C7',
    onWarningContainer: '#92400E',
    warningMuted: '#FCD34D',
    
    error: '#EF4444',
    onError: '#FFF5F5',
    errorContainer: '#FEE2E2',
    onErrorContainer: '#B91C1C',
    errorMuted: '#FCA5A5',
  },
  dark: {
    text: '#ffffff',
    background: '#000000',
    backgroundElement: '#212225',
    backgroundSelected: '#2E3135',
    textSecondary: '#B0B4BA',
    
    primary: '#5BAAFF',
    onPrimary: '#001B3A',
    primaryContainer: '#003870',
    onPrimaryContainer: '#A8D4FF',
    primaryMuted: '#2E6FAF',

    secondaryYellow: '#FFD54F',
    onSecondaryYellow: '#1A1000',
    secondaryYellowContainer: '#3D2E00',
    onSecondaryYellowContainer: '#FFDF80',
    secondaryYellowMuted: '#B38A00',
    
    success: '#4ADE80',
    onSuccess: '#052E16',
    successContainer: '#14532D',
    onSuccessContainer: '#BBF7D0',
    successMuted: '#166534',
    
    info: '#60A5FA',
    onInfo: '#172554',
    infoContainer: '#1E3A5F',
    onInfoContainer: '#BAE6FD',
    infoMuted: '#1E40AF',
    
    warning: '#FBBF24',
    onWarning: '#1C0A00',
    warningContainer: '#3D2200',
    onWarningContainer: '#FDE68A',
    warningMuted: '#92400E',
    
    error: '#F87171',
    onError: '#2D0000',
    errorContainer: '#450A0A',
    onErrorContainer: '#FECACA',
    errorMuted: '#7F1D1D',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;
