/**
 * Placeholder Screen Template
 * Used for menu items that don't have full implementations yet
 * (Download, Recent, Genres, VIP, Profile, Admin Panel, TMDB Generator, etc.)
 */

import React from 'react';
import {View, Text, StyleSheet, SafeAreaView} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {COLORS, SPACING, FONT_SIZE, FONT_WEIGHT} from '../../theme/colors';

interface PlaceholderScreenProps {
  title: string;
  subtitle?: string;
  icon: string;
  requiresAuth?: boolean;
  adminOnly?: boolean;
}

const PlaceholderScreen: React.FC<PlaceholderScreenProps> = ({
  title,
  subtitle,
  icon,
  requiresAuth,
  adminOnly,
}) => {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.container}>
        <View style={styles.iconWrap}>
          <Icon name={icon} size={64} color={COLORS.primary} />
        </View>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}

        {requiresAuth ? (
          <View style={styles.badge}>
            <Icon name="lock" size={14} color={COLORS.warning} />
            <Text style={styles.badgeText}>Login required</Text>
          </View>
        ) : null}
        {adminOnly ? (
          <View style={[styles.badge, styles.adminBadge]}>
            <Icon name="shield" size={14} color={COLORS.primary} />
            <Text style={[styles.badgeText, {color: COLORS.primary}]}>
              Admin only
            </Text>
          </View>
        ) : null}

        <Text style={styles.comingSoon}>Coming Soon</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xxl,
  },
  iconWrap: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.xxxl,
    fontWeight: FONT_WEIGHT.bold,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.md,
    textAlign: 'center',
    marginBottom: SPACING.md,
    lineHeight: 22,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.warning + '22',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 999,
    marginTop: SPACING.sm,
  },
  adminBadge: {
    backgroundColor: COLORS.primary + '22',
  },
  badgeText: {
    color: COLORS.warning,
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.semibold,
    marginLeft: 4,
  },
  comingSoon: {
    color: COLORS.textTertiary,
    fontSize: FONT_SIZE.sm,
    marginTop: SPACING.xxl,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});

export default PlaceholderScreen;
