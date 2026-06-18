/**
 * Menu Item definitions
 *
 * Each menu item has a `roles` array listing which user roles can see it.
 * The SidebarMenu component filters items based on the current user's role.
 *
 * Roles: 'guest' | 'user' | 'admin'
 *
 * Logic (per task requirements):
 * - Always Show (guest, user, admin): Home, Download, Recent, Genres, VIP
 * - Guest Only: Login
 * - User + Admin (logged in): Profile, Logout
 * - Admin Only: Admin Panel, TMDB Generator
 */

import {UserRole} from './auth';

export type MenuKey =
  | 'home'
  | 'download'
  | 'recent'
  | 'genres'
  | 'vip'
  | 'login'
  | 'profile'
  | 'admin_panel'
  | 'tmdb_generator'
  | 'logout';

export interface MenuItem {
  key: MenuKey;
  label: string;
  icon: string;          // MaterialIcons name
  iconType?: 'material' | 'material-community';
  roles: UserRole[];     // which roles can see this item
  description?: string;
}

export const MENU_ITEMS: MenuItem[] = [
  // === ALWAYS SHOW ===
  {
    key: 'home',
    label: 'Home',
    icon: 'home',
    roles: ['guest', 'user', 'admin'],
    description: 'Browse featured movies',
  },
  {
    key: 'download',
    label: 'Download',
    icon: 'download',
    roles: ['guest', 'user', 'admin'],
    description: 'Downloaded content',
  },
  {
    key: 'recent',
    label: 'Recent',
    icon: 'history',
    roles: ['guest', 'user', 'admin'],
    description: 'Recently viewed',
  },
  {
    key: 'genres',
    label: 'Genres',
    icon: 'category',
    roles: ['guest', 'user', 'admin'],
    description: 'Browse by genre',
  },
  {
    key: 'vip',
    label: 'VIP',
    icon: 'star',
    roles: ['guest', 'user', 'admin'],
    description: 'Premium content',
  },

  // === GUEST ONLY ===
  {
    key: 'login',
    label: 'Login',
    icon: 'login',
    roles: ['guest'],
    description: 'Sign in to your account',
  },

  // === LOGGED-IN USERS (user + admin) ===
  {
    key: 'profile',
    label: 'Profile',
    icon: 'account-circle',
    roles: ['user', 'admin'],
    description: 'Your account settings',
  },

  // === ADMIN ONLY ===
  {
    key: 'admin_panel',
    label: 'Admin Panel',
    icon: 'admin-panel-settings',
    roles: ['admin'],
    description: 'Manage users and content',
  },
  {
    key: 'tmdb_generator',
    label: 'TMDB Generator',
    icon: 'auto-awesome',
    roles: ['admin'],
    description: 'Generate content from TMDB',
  },

  // === LOGGED-IN USERS (user + admin) — Logout ===
  {
    key: 'logout',
    label: 'Logout',
    icon: 'logout',
    roles: ['user', 'admin'],
    description: 'Sign out of your account',
  },
];

/**
 * Filter menu items by user role
 */
export const filterMenuItems = (role: UserRole): MenuItem[] => {
  return MENU_ITEMS.filter(item => item.roles.includes(role));
};

export default MENU_ITEMS;
