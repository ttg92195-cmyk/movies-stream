/**
 * React Native CLI config
 *
 * Note: We do NOT use the `assets: ['./assets/fonts/']` approach because
 * in RN 0.74 with Hermes, the auto-linker doesn't reliably bundle
 * react-native-vector-icons fonts into the release APK.
 *
 * Instead, we use a Gradle `copyIconFonts` task in android/app/build.gradle
 * that copies the .ttf files from node_modules into android/app/src/main/assets/fonts/
 * before every mergeAssets step. This works reliably for both debug AND release.
 */

module.exports = {
  project: {
    ios: {},
    android: {},
  },
  dependencies: {
    // Disable the platform-specific linking for vector icons (we handle it via Gradle)
    'react-native-vector-icons': {
      platforms: {
        ios: null,
        android: null,
      },
    },
  },
};
