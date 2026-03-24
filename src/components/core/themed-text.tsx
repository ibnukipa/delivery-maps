import { Platform, StyleSheet, Text, type TextProps } from 'react-native';

import { Fonts, ThemeColor } from '@/constants/theme';
import { useColorTheme } from '@/hooks/use-color-theme';

export type ThemedTextProps = TextProps & {
  type?:
    | 'default'
    | 'title'
    | 'subtitle'
    | 'small'
    | 'smallBold'
    | 'link'
    | 'linkPrimary'
    | 'code'
    // — new —
    | 'display'
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'body-lg'
    | 'body-sm'
    | 'label'
    | 'caption';
  themeColor?: ThemeColor;
  dimmed?: boolean;
  italic?: boolean;
};

export function ThemedText({
  style,
  type = 'default',
  themeColor,
  dimmed = false,
  italic = false,
  ...rest
}: ThemedTextProps) {
  const colors = useColorTheme();
  
  const color = themeColor
    ? colors[themeColor]
    : dimmed
      ? colors.textSecondary
      : colors.text;
  
  return (
    <Text
      style={[
        { color, fontStyle: italic ? 'italic' : 'normal' },
        styles[type],
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  // ── existing ──────────────────────────────────────
  default: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
  },
  title: {
    fontSize: 48,
    fontWeight: '600',
    lineHeight: 52,
  },
  subtitle: {
    fontSize: 32,
    lineHeight: 44,
    fontWeight: '600',
  },
  small: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
  smallBold: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
  },
  link: {
    lineHeight: 30,
    fontSize: 14,
  },
  linkPrimary: {
    lineHeight: 30,
    fontSize: 14,
    color: '#3c87f7',
  },
  code: {
    fontFamily: Fonts?.mono,
    fontWeight: Platform.select({ android: '700' }) ?? '500',
    fontSize: 12,
  },
  
  // ── new ───────────────────────────────────────────
  display: {
    fontSize: 40,
    lineHeight: 48,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  h1: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  h2: {
    fontSize: 26,
    lineHeight: 34,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  h3: {
    fontSize: 22,
    lineHeight: 30,
    fontWeight: '600',
    letterSpacing: -0.1,
  },
  h4: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '500',
    letterSpacing: 0,
  },
  'body-lg': {
    fontSize: 17,
    lineHeight: 26,
    fontWeight: '400',
  },
  'body-sm': {
    fontSize: 13,
    lineHeight: 20,
    fontWeight: '400',
  },
  label: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  caption: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '400',
    letterSpacing: 0.2,
  },
});
