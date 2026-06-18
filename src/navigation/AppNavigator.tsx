/**
 * App Navigation — V2
 *
 * Structure:
 *   App
 *   └─ AuthProvider
 *      └─ GestureHandlerRootView
 *         └─ BottomTabs (Home / Movies / Series / Settings)
 *            └─ Each tab is a NativeStackNavigator
 *
 * Sidebar menu is implemented as a custom modal overlay
 * (not react-navigation/drawer) for full control over role-based items.
 *
 * Menu items navigate to a "Menu" stack containing:
 *   - Download, Recent, Genres, VIP, Login, Profile,
 *     AdminPanel, TMDBGenerator
 *
 * The Menu stack is rendered on top of the bottom tabs,
 * so menu items appear above the tab bar.
 */

import React, {useState, useCallback} from 'react';
import {NavigationContainer, DarkTheme} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
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

// === SCREEN OPTIONS ===
const stackScreenOptions = {
  headerStyle: {backgroundColor: COLORS.background},
  headerTintColor: COLORS.textPrimary,
  headerShadowVisible: false,
  contentStyle: {backgroundColor: COLORS.background},
};

// === SHARED STACK (used by all 4 tabs) ===
const SharedStackScreens = () => (
  <Stack.Group>
    <Stack.Screen
      name="MovieDetail"
      component={MovieDetailScreen}
      options={({route}) => ({title: route.params.movie.title})}
    />
    <Stack.Screen
      name="VideoPlayer"
      component={VideoPlayerScreen}
      options={{headerShown: false, orientation: 'landscape'}}
    />
    <Stack.Screen
      name="Search"
      component={SearchScreen}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="Favorites"
      component={FavoritesScreen}
      options={{headerShown: false}}
    />
  </Stack.Group>
);

// === MENU STACK SCREENS ===
const MenuStackScreens = () => (
  <Stack.Group>
    <Stack.Screen
      name="MenuDownload"
      component={(props: any) => (
        <PlaceholderScreen
          title="Downloads"
          subtitle="Your downloaded movies and series will appear here."
          icon="download"
        />
      )}
      options={{title: 'Download'}}
    />
    <Stack.Screen
      name="MenuRecent"
      component={(props: any) => (
        <PlaceholderScreen
          title="Recently Viewed"
          subtitle="Movies and series you've watched recently."
          icon="history"
        />
      )}
      options={{title: 'Recent'}}
    />
    <Stack.Screen
      name="MenuGenres"
      component={(props: any) => (
        <PlaceholderScreen
          title="Genres"
          subtitle="Browse content by genre (Action, Comedy, Drama, etc.)"
          icon="category"
        />
      )}
      options={{title: 'Genres'}}
    />
    <Stack.Screen
      name="MenuVIP"
      component={(props: any) => (
        <PlaceholderScreen
          title="VIP Content"
          subtitle="Premium content exclusive to VIP members."
          icon="star"
        />
      )}
      options={{title: 'VIP'}}
    />
    <Stack.Screen
      name="MenuLogin"
      component={LoginScreen}
      options={{title: 'Login'}}
    />
    <Stack.Screen
      name="MenuProfile"
      component={ProfileScreen}
      options={{title: 'Profile'}}
    />
    <Stack.Screen
      name="MenuAdminPanel"
      component={(props: any) => (
        <PlaceholderScreen
          title="Admin Panel"
          subtitle="Manage users, content, and app settings."
          icon="admin-panel-settings"
          adminOnly
        />
      )}
      options={{title: 'Admin Panel'}}
    />
    <Stack.Screen
      name="MenuTMDBGenerator"
      component={(props: any) => (
        <PlaceholderScreen
          title="TMDB Generator"
          subtitle="Fetch and generate movie data from TMDB API."
          icon="auto-awesome"
          adminOnly
        />
      )}
      options={{title: 'TMDB Generator'}}
    />
  </Stack.Group>
);

// === HOME STACK ===
const HomeStack = ({onMenuToggle, onSearchNavigate}: {
  onMenuToggle: () => void;
  onSearchNavigate: () => void;
}) => (
  <Stack.Navigator screenOptions={stackScreenOptions}>
    <Stack.Screen
      name="Home"
      options={{headerShown: false}}
    >
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
    <SharedStackScreens />
    <MenuStackScreens />
  </Stack.Navigator>
);

// === MOVIES STACK ===
const MoviesStack = () => (
  <Stack.Navigator screenOptions={stackScreenOptions}>
    <Stack.Screen
      name="Movies"
      component={MoviesScreen}
      options={{headerShown: false}}
    />
    <SharedStackScreens />
    <MenuStackScreens />
  </Stack.Navigator>
);

// === SERIES STACK ===
const SeriesStack = () => (
  <Stack.Navigator screenOptions={stackScreenOptions}>
    <Stack.Screen
      name="Series"
      component={SeriesScreen}
      options={{headerShown: false}}
    />
    <SharedStackScreens />
    <MenuStackScreens />
  </Stack.Navigator>
);

// === SETTINGS STACK ===
const SettingsStack = () => (
  <Stack.Navigator screenOptions={stackScreenOptions}>
    <Stack.Screen
      name="Settings"
      component={SettingsScreen}
      options={{headerShown: false}}
    />
    <SharedStackScreens />
    <MenuStackScreens />
  </Stack.Navigator>
);

// === MAIN APP NAVIGATOR ===
const AppNavigator = () => {
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
      // Navigate within the current tab's stack
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
    <NavigationContainer
      theme={AppDarkTheme}
      ref={navigationRef}
    >
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
