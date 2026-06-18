/**
 * App Navigation Setup
 * Bottom Tabs: Home | Search | Favorites
 * Stack: Home → Detail → Player
 */

import React from 'react';
import {NavigationContainer, DarkTheme} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';

import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import MovieDetailScreen from '../screens/MovieDetailScreen';
import VideoPlayerScreen from '../screens/VideoPlayerScreen';
import {COLORS} from '../theme/colors';
import {Movie} from '../types/movie';

export type RootStackParamList = {
  Home: undefined;
  MovieDetail: {movie: Movie};
  VideoPlayer: {movie: Movie};
};

export type TabParamList = {
  HomeTab: undefined;
  SearchTab: undefined;
  FavoritesTab: undefined;
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

const HomeStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {backgroundColor: COLORS.background},
      headerTintColor: COLORS.textPrimary,
      headerShadowVisible: false,
      contentStyle: {backgroundColor: COLORS.background},
    }}>
    <Stack.Screen
      name="Home"
      component={HomeScreen}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="MovieDetail"
      component={MovieDetailScreen}
      options={({route}) => ({
        title: route.params.movie.title,
        headerBackTitle: 'Back',
      })}
    />
    <Stack.Screen
      name="VideoPlayer"
      component={VideoPlayerScreen}
      options={{
        headerShown: false,
        orientation: 'landscape',
      }}
    />
  </Stack.Navigator>
);

const SearchStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {backgroundColor: COLORS.background},
      headerTintColor: COLORS.textPrimary,
      headerShadowVisible: false,
      contentStyle: {backgroundColor: COLORS.background},
    }}>
    <Stack.Screen
      name="Search"
      component={SearchScreen}
      options={{headerShown: false}}
    />
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
  </Stack.Navigator>
);

const FavoritesStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {backgroundColor: COLORS.background},
      headerTintColor: COLORS.textPrimary,
      headerShadowVisible: false,
      contentStyle: {backgroundColor: COLORS.background},
    }}>
    <Stack.Screen
      name="Favorites"
      component={FavoritesScreen}
      options={{headerShown: false}}
    />
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
  </Stack.Navigator>
);

const AppNavigator = () => {
  return (
    <NavigationContainer theme={AppDarkTheme}>
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
          component={HomeStack}
          options={{
            tabBarLabel: 'Home',
            tabBarIcon: ({color, size}) => (
              <Icon name="home" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="SearchTab"
          component={SearchStack}
          options={{
            tabBarLabel: 'Search',
            tabBarIcon: ({color, size}) => (
              <Icon name="search" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="FavoritesTab"
          component={FavoritesStack}
          options={{
            tabBarLabel: 'Favorites',
            tabBarIcon: ({color, size}) => (
              <Icon name="favorite" color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
