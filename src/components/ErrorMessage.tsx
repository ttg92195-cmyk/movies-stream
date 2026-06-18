/**
 * ErrorMessage — Display error with retry button
 */

import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {COLORS, SPACING, RADIUS, FONT_SIZE, FONT_WEIGHT} from '../theme/colors';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({message, onRetry}) => {
  return (
    <View style={styles.container}>
      <Icon name="error-outline" size={56} color={COLORS.error} />
      <Text style={styles.message}>{message}</Text>
      {onRetry ? (
        <TouchableOpacity style={styles.retryBtn} onPress={onRetry}>
          <Icon name="refresh" size={16} color={COLORS.textPrimary} />
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xxl,
  },
  message: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.md,
    marginTop: SPACING.md,
    textAlign: 'center',
    lineHeight: 22,
  },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm + 2,
    borderRadius: RADIUS.md,
    marginTop: SPACING.lg,
  },
  retryText: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.semibold,
    marginLeft: SPACING.xs,
  },
});

export default ErrorMessage;
