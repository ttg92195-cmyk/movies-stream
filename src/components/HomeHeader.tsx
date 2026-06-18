/**
 * HomeHeader — top bar for Home screen
 *
 * Layout:
 *   [Menu Icon]    [ZZZ Brand]    [Search Icon]
 *
 * - Menu Icon (left): opens SidebarMenu
 * - ZZZ (center): brand text in red accent
 * - Search Icon (right): navigates to Search tab
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {COLORS, SPACING, FONT_SIZE, FONT_WEIGHT} from '../theme/colors';

interface HomeHeaderProps {
  onMenuPress: () => void;
  onSearchPress: () => void;
  title?: string;
}

const HomeHeader: React.FC<HomeHeaderProps> = ({
  onMenuPress,
  onSearchPress,
  title = 'ZZZ',
}) => {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.container}>
        {/* Left: Menu icon */}
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={onMenuPress}
          activeOpacity={0.7}
          hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
          <Icon name="menu" size={26} color={COLORS.textPrimary} />
        </TouchableOpacity>

        {/* Center: ZZZ brand */}
        <View style={styles.brandWrap}>
          <Text style={styles.brandText}>{title}</Text>
        </View>

        {/* Right: Search icon */}
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={onSearchPress}
          activeOpacity={0.7}
          hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
          <Icon name="search" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    backgroundColor: COLORS.background,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.background,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.divider,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandText: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.xxxl,
    fontWeight: FONT_WEIGHT.heavy,
    letterSpacing: 2,
  },
});

export default HomeHeader;
