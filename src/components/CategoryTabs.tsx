/**
 * CategoryTabs — Horizontal category pills
 */

import React from 'react';
import {
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';

import {COLORS, SPACING, RADIUS, FONT_SIZE, FONT_WEIGHT} from '../theme/colors';

export interface CategoryItem {
  key: string;
  label: string;
}

interface CategoryTabsProps {
  categories: CategoryItem[];
  activeKey: string;
  onSelect: (key: string) => void;
  style?: ViewStyle;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({
  categories,
  activeKey,
  onSelect,
  style,
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[styles.container, style]}>
      {categories.map(cat => {
        const isActive = cat.key === activeKey;
        return (
          <TouchableOpacity
            key={cat.key}
            activeOpacity={0.7}
            onPress={() => onSelect(cat.key)}
            style={[styles.tab, isActive && styles.tabActive]}>
            <Text
              style={[styles.tabText, isActive && styles.tabTextActive]}>
              {cat.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
  },
  tab: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.surfaceElevated,
    marginRight: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tabActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  tabText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.medium,
  },
  tabTextActive: {
    color: COLORS.textPrimary,
    fontWeight: FONT_WEIGHT.bold,
  },
});

export default CategoryTabs;
