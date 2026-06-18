/**
 * Movies Tab Screen — placeholder for movie browsing
 * (Will be implemented with full movie list later)
 */

import React from 'react';
import {View, Text, StyleSheet, SafeAreaView} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {COLORS, SPACING, FONT_SIZE, FONT_WEIGHT} from '../theme/colors';

const MoviesScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.container}>
        <View style={styles.iconWrap}>
          <Icon name="movie" size={64} color={COLORS.primary} />
        </View>
        <Text style={styles.title}>Movies</Text>
        <Text style={styles.subtitle}>
          Browse all movies in one place.{'\n'}This screen will be implemented in the next iteration.
        </Text>
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
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.md,
    textAlign: 'center',
    marginTop: SPACING.sm,
    lineHeight: 22,
  },
  comingSoon: {
    color: COLORS.textTertiary,
    fontSize: FONT_SIZE.sm,
    marginTop: SPACING.xxl,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});

export default MoviesScreen;
