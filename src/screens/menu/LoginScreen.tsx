/**
 * Login Screen
 *
 * Mock login for testing role-based menu:
 * - Admin: admin / admin123
 * - User: user / user123  (or any non-empty username/password)
 *
 * Also has quick-login buttons for demo purposes.
 */

import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {COLORS, SPACING, RADIUS, FONT_SIZE, FONT_WEIGHT} from '../../theme/colors';
import {useAuth} from '../../hooks/useAuth';

const LoginScreen: React.FC = () => {
  const {login, loginAsAdmin, loginAsUser} = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter username and password');
      return;
    }
    setLoading(true);
    const result = await login(username.trim(), password);
    setLoading(false);
    if (!result.success) {
      Alert.alert('Login Failed', result.error || 'Unknown error');
    }
  };

  const handleQuickAdmin = async () => {
    setLoading(true);
    await loginAsAdmin();
    setLoading(false);
  };

  const handleQuickUser = async () => {
    setLoading(true);
    await loginAsUser();
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled">
        {/* Logo */}
        <View style={styles.logoWrap}>
          <View style={styles.logoCircle}>
            <Icon name="play-arrow" size={48} color={COLORS.textPrimary} />
          </View>
          <Text style={styles.brand}>ZZZ</Text>
          <Text style={styles.tagline}>Sign in to continue</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <View style={styles.inputWrap}>
            <Icon
              name="person"
              size={20}
              color={COLORS.textSecondary}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor={COLORS.textTertiary}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
            />
          </View>

          <View style={styles.inputWrap}>
            <Icon
              name="lock"
              size={20}
              color={COLORS.textSecondary}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={COLORS.textTertiary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="go"
              onSubmitEditing={handleLogin}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeBtn}>
              <Icon
                name={showPassword ? 'visibility-off' : 'visibility'}
                size={20}
                color={COLORS.textSecondary}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.loginBtn, loading && styles.loginBtnDisabled]}
            onPress={handleLogin}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator color={COLORS.textPrimary} />
            ) : (
              <>
                <Icon name="login" size={20} color={COLORS.textPrimary} />
                <Text style={styles.loginBtnText}>Sign In</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Quick demo logins */}
        <View style={styles.demoWrap}>
          <Text style={styles.demoTitle}>Quick Demo Login</Text>
          <Text style={styles.demoSubtitle}>
            For testing role-based menu items
          </Text>

          <TouchableOpacity
            style={styles.demoBtn}
            onPress={handleQuickAdmin}
            disabled={loading}>
            <Icon name="shield" size={18} color={COLORS.primary} />
            <Text style={styles.demoBtnText}>Login as Admin</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.demoBtn, styles.demoBtnUser]}
            onPress={handleQuickUser}
            disabled={loading}>
            <Icon name="person" size={18} color={COLORS.success} />
            <Text style={[styles.demoBtnText, {color: COLORS.success}]}>
              Login as User
            </Text>
          </TouchableOpacity>

          <View style={styles.credsCard}>
            <Text style={styles.credsTitle}>Demo credentials</Text>
            <Text style={styles.credsLine}>Admin: admin / admin123</Text>
            <Text style={styles.credsLine}>User: user / user123</Text>
            <Text style={styles.credsNote}>
              (Or any non-empty username + password)
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: SPACING.xl,
    paddingBottom: SPACING.xxxl,
  },
  logoWrap: {
    alignItems: 'center',
    marginTop: SPACING.xxl,
    marginBottom: SPACING.xxl,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  brand: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.title,
    fontWeight: FONT_WEIGHT.heavy,
    letterSpacing: 4,
  },
  tagline: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.md,
    marginTop: SPACING.xs,
  },
  form: {
    marginBottom: SPACING.xl,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.md,
    paddingHorizontal: SPACING.md,
    height: 52,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  inputIcon: {
    marginRight: SPACING.sm,
  },
  input: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.md,
    padding: 0,
  },
  eyeBtn: {
    padding: SPACING.xs,
  },
  loginBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md + 2,
    borderRadius: RADIUS.md,
    marginTop: SPACING.sm,
  },
  loginBtnDisabled: {
    opacity: 0.6,
  },
  loginBtnText: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
    marginLeft: SPACING.xs,
  },
  demoWrap: {
    alignItems: 'center',
  },
  demoTitle: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold,
  },
  demoSubtitle: {
    color: COLORS.textTertiary,
    fontSize: FONT_SIZE.xs,
    marginTop: 2,
    marginBottom: SPACING.lg,
  },
  demoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary + '22',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: RADIUS.md,
    width: '100%',
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.primary + '44',
  },
  demoBtnUser: {
    backgroundColor: COLORS.success + '22',
    borderColor: COLORS.success + '44',
  },
  demoBtnText: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold,
    marginLeft: SPACING.xs,
  },
  credsCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
    marginTop: SPACING.lg,
    width: '100%',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  credsTitle: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.semibold,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: SPACING.xs,
  },
  credsLine: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.sm,
    fontFamily: 'monospace',
    marginBottom: 2,
  },
  credsNote: {
    color: COLORS.textTertiary,
    fontSize: FONT_SIZE.xs,
    marginTop: SPACING.xs,
    fontStyle: 'italic',
  },
});

export default LoginScreen;
