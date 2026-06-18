/**
 * EmptyState — Friendly placeholder for empty lists/errors
 */

import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {COLORS, SPACING, FONT_SIZE, FONT_WEIGHT} from '../theme/colors';

interface EmptyStateProps {
  icon?: string;
  title: string;
  subtitle?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'info-outline',
  title,
  subtitle,
}) => {
  return (
    <View style={styles.container}>
      <Icon name={icon} size={64} color={COLORS.textTertiary} />
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
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
  title: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.semibold,
    marginTop: SPACING.md,
    textAlign: 'center',
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
    marginTop: SPACING.xs,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default EmptyState;
