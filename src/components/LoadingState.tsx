/**
 * LoadingState — Centered spinner for full-screen loading
 */

import React from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';
import {COLORS} from '../theme/colors';

interface LoadingStateProps {
  size?: 'small' | 'large';
  color?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({
  size = 'large',
  color = COLORS.primary,
}) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingVertical: 32,
  },
});

export default LoadingState;
