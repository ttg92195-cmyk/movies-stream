/**
 * Settings Tab Screen
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {COLORS, SPACING, RADIUS, FONT_SIZE, FONT_WEIGHT} from '../theme/colors';
import {useAuth} from '../hooks/useAuth';

const SettingsScreen: React.FC = () => {
  const {user, role, logout} = useAuth();

  const settingsGroups = [
    {
      title: 'Playback',
      items: [
        {icon: 'play-circle-outline', label: 'Video Quality', value: 'Auto'},
        {icon: 'closed-caption', label: 'Subtitles', value: 'Off'},
        {icon: 'autorenew', label: 'Autoplay Next', value: 'On'},
      ],
    },
    {
      title: 'Downloads',
      items: [
        {icon: 'storage', label: 'Download Quality', value: 'Standard'},
        {icon: 'wifi', label: 'Download over Wi-Fi only', value: 'On'},
      ],
    },
    {
      title: 'Notifications',
      items: [
        {icon: 'notifications', label: 'Push Notifications', value: 'On'},
        {icon: 'email', label: 'Email Updates', value: 'Off'},
      ],
    },
    {
      title: 'About',
      items: [
        {icon: 'info', label: 'Version', value: '1.0.0'},
        {icon: 'description', label: 'Terms of Service'},
        {icon: 'privacy-tip', label: 'Privacy Policy'},
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView style={styles.container}>
        <Text style={styles.pageTitle}>Settings</Text>

        {settingsGroups.map((group, gi) => (
          <View key={gi} style={styles.group}>
            <Text style={styles.groupTitle}>{group.title}</Text>
            <View style={styles.card}>
              {group.items.map((item, ii) => (
                <View
                  key={ii}
                  style={[
                    styles.row,
                    ii < group.items.length - 1 && styles.rowBorder,
                  ]}>
                  <Icon
                    name={item.icon}
                    size={20}
                    color={COLORS.textSecondary}
                  />
                  <Text style={styles.rowLabel}>{item.label}</Text>
                  {item.value ? (
                    <Text style={styles.rowValue}>{item.value}</Text>
                  ) : (
                    <Icon
                      name="chevron-right"
                      size={18}
                      color={COLORS.textTertiary}
                    />
                  )}
                </View>
              ))}
            </View>
          </View>
        ))}

        {/* Account section — only show if logged in */}
        {user ? (
          <View style={styles.group}>
            <Text style={styles.groupTitle}>Account ({role})</Text>
            <View style={styles.card}>
              <View style={styles.row}>
                <Icon name="person" size={20} color={COLORS.textSecondary} />
                <Text style={styles.rowLabel}>Logged in as</Text>
                <Text style={styles.rowValue}>{user.username}</Text>
              </View>
              <View style={[styles.row, styles.rowBorder]}>
                <TouchableOpacity
                  style={styles.logoutRow}
                  onPress={logout}>
                  <Icon name="logout" size={20} color={COLORS.error} />
                  <Text style={[styles.rowLabel, {color: COLORS.error}]}>
                    Logout
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ) : null}
      </ScrollView>
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
    padding: SPACING.lg,
  },
  pageTitle: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.xxxl,
    fontWeight: FONT_WEIGHT.heavy,
    marginBottom: SPACING.lg,
  },
  group: {
    marginBottom: SPACING.lg,
  },
  groupTitle: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.semibold,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: SPACING.sm,
    marginLeft: SPACING.xs,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md + 2,
  },
  rowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.divider,
  },
  rowLabel: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.md,
    marginLeft: SPACING.md,
  },
  rowValue: {
    color: COLORS.textTertiary,
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.medium,
  },
  logoutRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 0,
  },
});

export default SettingsScreen;
