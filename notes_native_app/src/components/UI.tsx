import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ViewStyle, TextStyle, GestureResponderEvent } from 'react-native';
import { cardStyle, spacing, themeColors } from '../theme/theme';

type ButtonProps = {
  title: string;
  onPress?: (e: GestureResponderEvent) => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  disabled?: boolean;
  style?: ViewStyle;
};

export const Button: React.FC<ButtonProps> = ({ title, onPress, variant = 'primary', disabled, style }) => {
  const bg = variant === 'primary' ? themeColors.primary
    : variant === 'secondary' ? themeColors.secondary
    : variant === 'danger' ? themeColors.error
    : 'transparent';

  const color = variant === 'ghost' ? themeColors.primary : '#fff';
  const borderColor = variant === 'ghost' ? themeColors.primary : 'transparent';

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        { backgroundColor: bg, borderColor },
        disabled && { opacity: 0.6 },
        style
      ]}
      activeOpacity={0.85}
    >
      <Text style={[styles.buttonText, { color }]}>{title}</Text>
    </TouchableOpacity>
  );
};

type InputProps = {
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  multiline?: boolean;
  style?: ViewStyle;
  inputStyle?: TextStyle;
};

export const Input: React.FC<InputProps> = ({ value, onChangeText, placeholder, multiline, style, inputStyle }) => {
  return (
    <View style={[styles.inputWrap, style]}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={themeColors.muted}
        multiline={multiline}
        style={[styles.input, multiline && { height: 160, textAlignVertical: 'top' }, inputStyle]}
      />
    </View>
  );
};

export const Card: React.FC<{ style?: ViewStyle; children: React.ReactNode }> = ({ style, children }) => {
  return <View style={[styles.card, style]}>{children}</View>;
};

export const FAB: React.FC<{ onPress: () => void; label?: string }> = ({ onPress, label = '+' }) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9} style={styles.fab}>
      <Text style={styles.fabText}>{label}</Text>
    </TouchableOpacity>
  );
};

export const EmptyState: React.FC<{ title: string; subtitle?: string; actionLabel?: string; onAction?: () => void }> = ({ title, subtitle, actionLabel, onAction }) => {
  return (
    <View style={styles.emptyWrap}>
      <Text style={styles.emptyTitle}>{title}</Text>
      {subtitle ? <Text style={styles.emptySubtitle}>{subtitle}</Text> : null}
      {actionLabel && onAction ? <Button title={actionLabel} onPress={onAction} variant="primary" style={{ marginTop: spacing(3) }} /> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: spacing(3),
    paddingHorizontal: spacing(5),
    borderRadius: 10,
    borderWidth: 1
  },
  buttonText: {
    fontWeight: '600',
    fontSize: 16
  },
  inputWrap: {
    ...cardStyle,
    padding: spacing(2)
  },
  input: {
    backgroundColor: themeColors.surface,
    color: themeColors.text,
    borderRadius: 8,
    paddingHorizontal: spacing(3),
    paddingVertical: spacing(3),
    borderWidth: 1,
    borderColor: '#e5e7eb',
    fontSize: 16
  },
  card: {
    ...cardStyle
  },
  fab: {
    position: 'absolute',
    right: spacing(5),
    bottom: spacing(5),
    backgroundColor: themeColors.primary,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4
  },
  fabText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
    marginTop: -2
  },
  emptyWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing(6)
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: themeColors.text
  },
  emptySubtitle: {
    marginTop: spacing(2),
    fontSize: 14,
    color: themeColors.muted,
    textAlign: 'center'
  }
});
