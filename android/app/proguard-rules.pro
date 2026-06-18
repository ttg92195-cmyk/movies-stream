# Add project specific ProGuard rules here.

# === Keep React Native core ===
-keep class com.facebook.react.** { *; }
-keep class com.facebook.hermes.** { *; }
-keep class com.moviesstream.** { *; }

# === Vector Icons (CRITICAL for release APK) ===
# Without these rules, react-native-vector-icons fonts get stripped/minified
# in release builds, causing icons to render as [X] tofu boxes.
-keep class com.oblador.vectoricons.** { *; }
-keep class com.oblador.vectoricons.rn.RNVectorIconsPackage { *; }
-keep class com.reactnativecommunity.** { *; }
-keep class com.reactnativecommunity.icons.** { *; }
-keep class com.reactnativecommunity.icons.rn.RNVectorIconsPackage { *; }
# Keep font file references
-keep class **.R$font { *; }
-keep class **.R$raw { *; }

# === Async Storage ===
-keep class com.reactnativecommunity.asyncstorage.** { *; }

# === React Native Video ===
-keep class com.brentvatne.** { *; }
-keep class com.brentvatne.exoplayer.** { *; }
-keep class com.google.android.exoplayer2.** { *; }
-keep class androidx.media3.** { *; }

# === Linear Gradient ===
-keep class com.BV.LinearGradient.** { *; }

# === Safe Area Context ===
-keep class com.th3rdwave.safeareacontext.** { *; }

# === Screens ===
-keep class com.swmansion.rnscreens.** { *; }

# === DO NOT strip font resources ===
-keep class android.graphics.Typeface { *; }
-keep class android.graphics.fonts.** { *; }
-keep class androidx.core.content.res.ResourcesCompat { *; }
-keep class androidx.core.graphics.TypefaceCompat { *; }
-keep class androidx.core.graphics.TypefaceCompatBaseImpl { *; }

# === Keep resource files (including fonts in assets) ===
-keep class **.R$* { *; }
-keep class **.R { *; }
-keepclassmembers class **.R$* { <fields>; }
-keepclassmembers class **.R { <fields>; }

# === Keep metadata for reflection ===
-keepattributes *Annotation*
-keepattributes Signature, InnerClasses, EnclosingMethod
-keepattributes RuntimeVisibleAnnotations, RuntimeInvisibleAnnotations
-keepattributes RuntimeVisibleParameterAnnotations, RuntimeInvisibleParameterAnnotations
-keepattributes RuntimeVisibleTypeAnnotations, RuntimeInvisibleTypeAnnotations
-keepattributes SourceFile, LineNumberTable

# === Hermes JS engine ===
-keep class com.facebook.hermes.** { *; }
-dontwarn com.facebook.hermes.**

# === Disable warnings for missing optional classes ===
-dontwarn org.webkit.**
-dontwarn javax.annotation.**

# === Optimization passes ===
-optimizationpasses 1
-allowaccessmodification
-mergeinterfacesaggressively

# === Specifically keep assets dir (critical) ===
# This tells ProGuard to not strip the assets/fonts/ directory contents
-keep class assets.** { *; }
-keep class assets.fonts.** { *; }
