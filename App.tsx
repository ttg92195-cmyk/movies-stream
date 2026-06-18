/**
 * MoviesStream App — Root Component
 * Movie Streaming MVP built with React Native
 * Theme: Netflix Dark + Red Accent (#E50914)
 */

import React, {useEffect} from 'react';
import {StatusBar, LogBox} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import AppNavigator from './src/navigation/AppNavigator';
import {COLORS} from './src/theme/colors';

// Suppress minor warnings for cleaner dev experience
LogBox.ignoreLogs([
  'ViewPropTypes will be removed',
  'ColorPropType will be removed',
]);

const App: React.FC = () => {
  useEffect(() => {
    // Lock status bar to light content (white icons on dark bg)
    StatusBar.setBarStyle('light-content');
    StatusBar.setBackgroundColor(COLORS.background);
    StatusBar.setTranslucent(true);
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.background}
        translucent
      />
      <AppNavigator />
    </SafeAreaProvider>
  );
};

export default App;
