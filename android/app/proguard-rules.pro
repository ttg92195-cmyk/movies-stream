# Add project specific ProGuard rules here.
# Keep React Native classes
-keep class com.facebook.react.** { *; }
-keep class com.facebook.hermes.** { *; }
-keep class com.moviesstream.** { *; }

# Keep vector icons (critical for release APKs)
-keep class com.oblador.vectoricons.** { *; }
-keep class com.reactnativecommunity.** { *; }

# Keep video
-keep class com.brentvatne.** { *; }

# Keep async storage
-keep class com.reactnativecommunity.asyncstorage.** { *; }

# Do NOT strip font resources
-keep class android.graphics.Typeface { *; }
-keepattributes *Annotation*

# Keep resource files (including fonts in assets)
-keep class **.R$* { *; }
-keep class **.R { *; }

# Keep metadata for resource resolution
-keepattributes Signature, InnerClasses, EnclosingMethod
-keepattributes RuntimeVisibleAnnotations, RuntimeInvisibleAnnotations
-keepattributes RuntimeVisibleParameterAnnotations, RuntimeInvisibleParameterAnnotations
-keepattributes RuntimeVisibleTypeAnnotations, RuntimeInvisibleTypeAnnotations
