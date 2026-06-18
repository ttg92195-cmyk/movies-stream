/**
 * SearchBar — Dark themed search input
 */

import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {COLORS, SPACING, RADIUS, FONT_SIZE} from '../theme/colors';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit?: () => void;
  onClear?: () => void;
  loading?: boolean;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  onSubmit,
  onClear,
  loading,
  placeholder = 'Search movies...',
}) => {
  return (
    <View style={styles.container}>
      <Icon
        name="search"
        size={20}
        color={COLORS.textSecondary}
        style={styles.icon}
      />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textTertiary}
        style={styles.input}
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
      />
      {loading ? (
        <ActivityIndicator size="small" color={COLORS.primary} />
      ) : value.length > 0 ? (
        <TouchableOpacity onPress={onClear} style={styles.clearBtn}>
          <Icon name="close" size={18} color={COLORS.textSecondary} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.md,
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  icon: {
    marginRight: SPACING.sm,
  },
  input: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.md,
    padding: 0,
  },
  clearBtn: {
    padding: SPACING.xs,
  },
});

export default SearchBar;
