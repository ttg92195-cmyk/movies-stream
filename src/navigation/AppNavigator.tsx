/**
 * App Navigation — V3 (Fixed: navigator children validation)
 *
 * Structure:
 *   App
 *   └─ AuthProvider
 *      └─ BottomTabs (Home / Movies / Series / Settings)
 *         └─ Each tab is a NativeStackNavigator
 *
 * Sidebar menu is a custom modal overlay.
 *
 * CRITICAL FIX in V3:
 *   React Navigation v6 requires that <Stack.Navigator> contains ONLY
 *   <Stack.Screen>, <Stack.Group>, or <React.Fragment> as direct children.
 *   Function-call children like <SharedStackScreens /> are NOT allowed.
 *   The previous code crashed at runtime with:
 *     "A navigator can only contain 'Screen', 'Group' or 'React.Fragment'"
 *
 *   Fix: build arrays of <Stack.Screen> elements (one for shared routes,
 *   one for menu routes) and spread them as children of each Stack.Navigator.
 *   React.Fragment wrapping each Spread preserves the children validation.
 */

import React, {useState, useCallback} from 'react';
import {NavigationContainer, DarkTheme} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {COLORS} from '../theme/colors';
import {MenuKey} from '../types/menu';

// Tab screens
import HomeScreen from '../screens/HomeScreen';
import MoviesScreen from '../screens/MoviesScreen';
import SeriesScreen from '../screens/SeriesScreen';
import SettingsScreen from '../screens/SettingsScreen';

// Stack screens (shared between tabs)
import MovieDetailScreen from '../screens/MovieDetailScreen';
import VideoPlayerScreen from '../screens/VideoPlayerScreen';
import SearchScreen from '../screens/SearchScreen';
import FavoritesScreen from '../screens/FavoritesScreen';

// Menu screens
import PlaceholderScreen from '../screens/menu/PlaceholderScreen';
import LoginScreen from '../screens/menu/LoginScreen';
import ProfileScreen from '../screens/menu/ProfileScreen';

// Sidebar + Header
import SidebarMenu from '../components/SidebarMenu';
import HomeHeader from '../components/HomeHeader';

// === Types ===
export type TabParamList = {
  HomeTab: undefined;
  MoviesTab: undefined;
  SeriesTab: undefined;
  SettingsTab: undefined;
};

export type RootStackParamList = {
  Home: undefined;
  Movies: undefined;
  Series: undefined;
  Settings: undefined;
  Search: undefined;
  Favorites: undefined;
  MovieDetail: {movie: any};
  VideoPlayer: {movie: any};
  // Menu items
  MenuDownload: undefined;
  MenuRecent: undefined;
  MenuGenres: undefined;
  MenuVIP: undefined;
  MenuLogin: undefined;
  MenuProfile: undefined;
  MenuAdminPanel: undefined;
  MenuTMDBGenerator: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

const AppDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: COLORS.background,
    card: COLORS.surface,
    text: COLORS.textPrimary,
    border: COLORS.border,
    primary: COLORS.primary,
    notification: COLORS.primary,
  },
};

const stackScreenOptions = {
  headerStyle: {backgroundColor: COLORS.background},
  headerTintColor: COLORS.textPrimary,
  headerShadowVisible: false,
  contentStyle: {backgroundColor: COLORS.background},
};

// === SHARED SCREENS (built once, spread into each Stack.Navigator) ===
// These are <Stack.Screen> elements (which are valid Navigator children
// when spread inside a Fragment).
const sharedScreens = [
  <Stack.Screen
    key="MovieDetail"
    name="MovieDetail"
    component={MovieDetailScreen}
    options={({route}: {route: any}) => ({title: route.params.movie.title})}
  />,
  <Stack.Screen
    key="VideoPlayer"
    name="VideoPlayer"
    component={VideoPlayerScreen}
    options={{headerShown: false, orientation: 'landscape'}}
  />,
  <Stack.Screen
    key="Search"
    name="Search"
    component={SearchScreen}
    options={{headerShown: false}}
  />,
  <Stack.Screen
    key="Favorites"
    name="Favorites"
    component={FavoritesScreen}
    options={{headerShown: false}}
  />,
];

// === MENU SCREENS ===
const menuScreens = [
  <Stack.Screen
    key="MenuDownload"
    name="MenuDownload"
    options={{title: 'Download'}}>
    {() => (
      <PlaceholderScreen
        title="Downloads"
        subtitle="Your downloaded movies and series will appear here."
        icon="download"
      />
    )}
  </Stack.Screen>,
  <Stack.Screen
    key="MenuRecent"
    name="MenuRecent"
    options={{title: 'Recent'}}>
    {() => (
      <PlaceholderScreen
        title="Recently Viewed"
        subtitle="Movies and series you've watched recently."
        icon="history"
      />
    )}
  </Stack.Screen>,
  <Stack.Screen
    key="MenuGenres"
    name="MenuGenres"
    options={{title: 'Genres'}}>
    {() => (
      <PlaceholderScreen
        title="Genres"
        subtitle="Browse content by genre (Action, Comedy, Drama, etc.)"
        icon="category"
      />
    )}
  </Stack.Screen>,
  <Stack.Screen
    key="MenuVIP"
    name="MenuVIP"
    options={{title: 'VIP'}}>
    {() => (
      <PlaceholderScreen
        title="VIP Content"
        subtitle="Premium content exclusive to VIP members."
        icon="star"
      />
    )}
  </Stack.Screen>,
  <Stack.Screen
    key="MenuLogin"
    name="MenuLogin"
    component={LoginScreen}
    options={{title: 'Login'}}
  />,
  <Stack.Screen
    key="MenuProfile"
    name="MenuProfile"
    component={ProfileScreen}
    options={{title: 'Profile'}}
  />,
  <Stack.Screen
    key="MenuAdminPanel"
    name="MenuAdminPanel"
    options={{title: 'Admin Panel'}}>
    {() => (
      <PlaceholderScreen
        title="Admin Panel"
        subtitle="Manage users, content, and app settings."
        icon="admin-panel-settings"
        adminOnly
      />
    )}
  </Stack.Screen>,
  <Stack.Screen
    key="MenuTMDBGenerator"
    name="MenuTMDBGenerator"
    options={{title: 'TMDB Generator'}}>
    {() => (
      <PlaceholderScreen
        title="TMDB Generator"
        subtitle="Fetch and generate movie data from TMDB API."
        icon="auto-awesome"
        adminOnly
      />
    )}
  </Stack.Screen>,
];

// === HOME STACK ===
const HomeStack: React.FC<{
  onMenuToggle: () => void;
  onSearchNavigate: () => void;
}> = ({onMenuToggle, onSearchNavigate}) => (
  <Stack.Navigator screenOptions={stackScreenOptions}>
    <Stack.Screen name="Home" options={{headerShown: false}}>
      {(props: any) => (
        <HomeScreen
          {...props}
          headerComponent={
            <HomeHeader
              onMenuPress={onMenuToggle}
              onSearchPress={onSearchNavigate}
            />
          }
        />
      )}
    </Stack.Screen>
    {sharedScreens}
    {menuScreens}
  </Stack.Navigator>
);

// === MOVIES STACK ===
const MoviesStack: React.FC = () => (
  <Stack.Navigator screenOptions={stackScreenOptions}>
    <Stack.Screen
      name="Movies"
      component={MoviesScreen}
      options={{headerShown: false}}
    />
    {sharedScreens}
    {menuScreens}
  </Stack.Navigator>
);

// === SERIES STACK ===
const SeriesStack: React.FC = () => (
  <Stack.Navigator screenOptions={stackScreenOptions}>
    <Stack.Screen
      name="Series"
      component={SeriesScreen}
      options={{headerShown: false}}
    />
    {sharedScreens}
    {menuScreens}
  </Stack.Navigator>
);

// === SETTINGS STACK ===
const SettingsStack: React.FC = () => (
  <Stack.Navigator screenOptions={stackScreenOptions}>
    <Stack.Screen
      name="Settings"
      component={SettingsScreen}
      options={{headerShown: false}}
    />
    {sharedScreens}
    {menuScreens}
  </Stack.Navigator>
);

// === MAIN APP NAVIGATOR ===
const AppNavigator: React.FC = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const navigationRef = React.useRef<any>(null);

  const openMenu = useCallback(() => setMenuVisible(true), []);
  const closeMenu = useCallback(() => setMenuVisible(false), []);

  const handleMenuSelect = useCallback((key: MenuKey) => {
    const routeMap: Record<MenuKey, string> = {
      home: 'Home',
      download: 'MenuDownload',
      recent: 'MenuRecent',
      genres: 'MenuGenres',
      vip: 'MenuVIP',
      login: 'MenuLogin',
      profile: 'MenuProfile',
      admin_panel: 'MenuAdminPanel',
      tmdb_generator: 'MenuTMDBGenerator',
      logout: 'Home',  // After logout, go home (handled inside SidebarMenu)
    };

    const routeName = routeMap[key];
    if (routeName) {
      try {
        navigationRef.current?.navigate(routeName);
      } catch (err) {
        console.warn('Navigation failed for', key, err);
      }
    }
  }, []);

  const handleSearchPress = useCallback(() => {
    try {
      navigationRef.current?.navigate('Search');
    } catch (err) {
      console.warn('Search navigation failed', err);
    }
  }, []);

  return (
    <NavigationContainer theme={AppDarkTheme} ref={navigationRef}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: COLORS.surface,
            borderTopColor: COLORS.border,
            borderTopWidth: 1,
            paddingBottom: 4,
            height: 60,
          },
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: COLORS.textSecondary,
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '500',
          },
        }}>
        <Tab.Screen
          name="HomeTab"
          options={{
            tabBarLabel: 'Home',
            tabBarIcon: ({color, size}) => (
              <Icon name="home" color={color} size={size} />
            ),
          }}>
          {() => (
            <HomeStack
              onMenuToggle={openMenu}
              onSearchNavigate={handleSearchPress}
            />
          )}
        </Tab.Screen>

        <Tab.Screen
          name="MoviesTab"
          component={MoviesStack}
          options={{
            tabBarLabel: 'Movies',
            tabBarIcon: ({color, size}) => (
              <Icon name="movie" color={color} size={size} />
            ),
          }}
        />

        <Tab.Screen
          name="SeriesTab"
          component={SeriesStack}
          options={{
            tabBarLabel: 'Series',
            tabBarIcon: ({color, size}) => (
              <Icon name="tv" color={color} size={size} />
            ),
          }}
        />

        <Tab.Screen
          name="SettingsTab"
          component={SettingsStack}
          options={{
            tabBarLabel: 'Settings',
            tabBarIcon: ({color, size}) => (
              <Icon name="settings" color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>

      {/* Sidebar Menu overlay */}
      <SidebarMenu
        visible={menuVisible}
        onClose={closeMenu}
        onSelect={handleMenuSelect}
        activeKey="home"
      />
    </NavigationContainer>
  );
};

export default AppNavigator;
