/**
 * MoviesStream App — Root Component (V2)
 * Movie Streaming MVP built with React Native
 * Theme: Netflix Dark + Red Accent (#E50914)
 *
 * V2 additions:
 * - AuthProvider wraps the whole app for role-based menu
 * - GestureHandlerRootView for drawer gestures
 * - 4-tab navigation: Home / Movies / Series / Settings
 * - Custom SidebarMenu with role-based filtering (guest/user/admin)
 * - HomeHeader with Menu/ZZZ/Search layout
 */

import React, {useEffect} from 'react';
import {StatusBar, LogBox} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

import AppNavigator from './src/navigation/AppNavigator';
import {AuthProvider} from './src/context/AuthContext';
import {COLORS} from './src/theme/colors';

// Suppress minor warnings for cleaner dev experience
LogBox.ignoreLogs([
  'ViewPropTypes will be removed',
  'ColorPropType will be removed',
  'Sending `onAnimatedEvent` with no listeners registered',
  'Reanimated 2 failed to create a worklet',
]);

const App: React.FC = () => {
  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    StatusBar.setBackgroundColor(COLORS.background);
    StatusBar.setTranslucent(true);
  }, []);

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaProvider>
        <StatusBar
          barStyle="light-content"
          backgroundColor={COLORS.background}
          translucent
        />
        <AuthProvider>
          <AppNavigator />
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
