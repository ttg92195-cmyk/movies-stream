/**
 * SidebarMenu — custom drawer-style menu
 *
 * - Slides in from the left
 * - Filters items by user role (guest/user/admin)
 * - Shows current user info at top (avatar, name, role badge) if logged in
 * - Shows "Guest" header if not logged in
 * - Each item has icon + label + (optional) description
 * - Logout item has a distinct red color
 */

import React, {useMemo} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {COLORS, SPACING, RADIUS, FONT_SIZE, FONT_WEIGHT} from '../theme/colors';
import {filterMenuItems} from '../types/menu';
import {MenuKey} from '../types/menu';
import {useAuth} from '../hooks/useAuth';

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const DRAWER_WIDTH = Math.min(SCREEN_WIDTH * 0.82, 320);

interface SidebarMenuProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (key: MenuKey) => void;
  activeKey?: MenuKey;
}

const ROLE_LABELS: Record<string, string> = {
  guest: 'Guest',
  user: 'Member',
  admin: 'Administrator',
};

const ROLE_COLORS: Record<string, string> = {
  guest: COLORS.textTertiary,
  user: COLORS.success,
  admin: COLORS.primary,
};

const SidebarMenu: React.FC<SidebarMenuProps> = ({
  visible,
  onClose,
  onSelect,
  activeKey,
}) => {
  const {user, role, logout} = useAuth();
  const slideAnim = React.useRef(new Animated.Value(-DRAWER_WIDTH)).current;

  // Filter items by current role
  const visibleItems = useMemo(() => filterMenuItems(role), [role]);

  React.useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -DRAWER_WIDTH,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim]);

  const handleItemPress = (key: MenuKey) => {
    if (key === 'logout') {
      logout();
      onClose();
      return;
    }
    onSelect(key);
    onClose();
  };

  const roleLabel = ROLE_LABELS[role];
  const roleColor = ROLE_COLORS[role];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent>
      {/* Backdrop */}
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>

      {/* Drawer */}
      <Animated.View
        style={[
          styles.drawer,
          {width: DRAWER_WIDTH, transform: [{translateX: slideAnim}]},
        ]}>
        {/* Header — user info */}
        <View style={styles.header}>
          <View style={styles.avatarWrap}>
            {user ? (
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {user.username.charAt(0).toUpperCase()}
                </Text>
              </View>
            ) : (
              <View style={[styles.avatar, styles.guestAvatar]}>
                <Icon name="person" size={28} color={COLORS.textTertiary} />
              </View>
            )}
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.userName} numberOfLines={1}>
              {user ? user.username : 'Guest'}
            </Text>
            <View style={[styles.roleBadge, {backgroundColor: roleColor + '22'}]}>
              <View style={[styles.roleDot, {backgroundColor: roleColor}]} />
              <Text style={[styles.roleText, {color: roleColor}]}>
                {roleLabel}
              </Text>
            </View>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Icon name="close" size={22} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        {/* Menu items */}
        <ScrollView
          style={styles.menuList}
          contentContainerStyle={styles.menuListContent}
          showsVerticalScrollIndicator={false}>
          {visibleItems.map(item => {
            const isActive = item.key === activeKey;
            const isLogout = item.key === 'logout';
            return (
              <TouchableOpacity
                key={item.key}
                style={[
                  styles.menuItem,
                  isActive && styles.menuItemActive,
                  isLogout && styles.logoutItem,
                ]}
                onPress={() => handleItemPress(item.key)}
                activeOpacity={0.7}>
                <View style={[
                  styles.menuItemIcon,
                  isLogout && styles.logoutIcon,
                ]}>
                  <Icon
                    name={item.icon}
                    size={22}
                    color={
                      isLogout
                        ? COLORS.error
                        : isActive
                          ? COLORS.primary
                          : COLORS.textSecondary
                    }
                  />
                </View>
                <View style={styles.menuItemText}>
                  <Text
                    style={[
                      styles.menuItemLabel,
                      isLogout && styles.logoutLabel,
                      isActive && !isLogout && styles.menuItemLabelActive,
                    ]}>
                    {item.label}
                  </Text>
                  {item.description ? (
                    <Text
                      style={styles.menuItemDesc}
                      numberOfLines={1}>
                      {item.description}
                    </Text>
                  ) : null}
                </View>
                {!isLogout && (
                  <Icon
                    name="chevron-right"
                    size={18}
                    color={COLORS.textTertiary}
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>MoviesStream v1.0.0</Text>
        </View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    backgroundColor: COLORS.surface,
    elevation: 16,
    shadowColor: '#000',
    shadowOffset: {width: 2, height: 0},
    shadowOpacity: 0.5,
    shadowRadius: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    paddingTop: SPACING.xxl + 8,
    backgroundColor: COLORS.background,
  },
  avatarWrap: {
    marginRight: SPACING.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  guestAvatar: {
    backgroundColor: COLORS.surfaceElevated,
  },
  avatarText: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.bold,
  },
  headerInfo: {
    flex: 1,
  },
  userName: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.pill,
    marginTop: 4,
  },
  roleDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  roleText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.semibold,
  },
  closeBtn: {
    padding: SPACING.xs,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.divider,
  },
  menuList: {
    flex: 1,
  },
  menuListContent: {
    paddingVertical: SPACING.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.divider,
  },
  menuItemActive: {
    backgroundColor: COLORS.surfaceElevated,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
    paddingLeft: SPACING.lg - 3,
  },
  logoutItem: {
    marginTop: SPACING.sm,
  },
  menuItemIcon: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  logoutIcon: {
    backgroundColor: COLORS.error + '22',
    borderRadius: 18,
  },
  menuItemText: {
    flex: 1,
  },
  menuItemLabel: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.medium,
  },
  menuItemLabelActive: {
    color: COLORS.primary,
    fontWeight: FONT_WEIGHT.semibold,
  },
  logoutLabel: {
    color: COLORS.error,
    fontWeight: FONT_WEIGHT.semibold,
  },
  menuItemDesc: {
    color: COLORS.textTertiary,
    fontSize: FONT_SIZE.xs,
    marginTop: 2,
  },
  footer: {
    padding: SPACING.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.divider,
  },
  footerText: {
    color: COLORS.textTertiary,
    fontSize: FONT_SIZE.xs,
    textAlign: 'center',
  },
});

export default SidebarMenu;
