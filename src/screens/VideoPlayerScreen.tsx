/**
 * VideoPlayerScreen
 * - Full-screen video player with self-hosted URL
 * - Back button, title overlay
 * - Play/pause, seekbar (using react-native-video controls)
 */

import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Video from 'react-native-video';

import {Movie} from '../types/movie';
import {getStreamUrl} from '../services/videoSources';
import {COLORS, SPACING, RADIUS, FONT_SIZE, FONT_WEIGHT} from '../theme/colors';

import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'VideoPlayer'>;

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

const VideoPlayerScreen: React.FC<Props> = ({route, navigation}) => {
  const {movie} = route.params;
  const videoUrl = getStreamUrl(movie);
  const playerRef = useRef<Video>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paused, setPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [showControls, setShowControls] = useState(true);

  // Auto-hide controls after 4 seconds
  useEffect(() => {
    if (!showControls) return;
    const timer = setTimeout(() => {
      if (!paused) {
        setShowControls(false);
      }
    }, 4000);
    return () => clearTimeout(timer);
  }, [showControls, paused]);

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleSeek = (delta: number) => {
    const newTime = Math.max(0, Math.min(duration, currentTime + delta));
    playerRef.current?.seek(newTime);
    setCurrentTime(newTime);
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar hidden />
      <View style={styles.container}>
        <TouchableOpacity
          activeOpacity={1}
          style={styles.videoWrap}
          onPress={() => setShowControls(!showControls)}>
          <Video
            ref={playerRef}
            source={{uri: videoUrl}}
            style={styles.video}
            resizeMode="contain"
            paused={paused}
            onLoad={data => {
              setDuration(data.duration);
              setLoading(false);
            }}
            onProgress={data => {
              setCurrentTime(data.currentTime);
            }}
            onError={e => {
              console.error('Video error:', e);
              setError('Failed to load video. Please check the URL.');
              setLoading(false);
            }}
            onEnd={() => {
              setPaused(true);
              setShowControls(true);
            }}
            repeat={false}
            playWhenInactive={false}
            playInBackground={false}
          />

          {/* Loading overlay */}
          {loading ? (
            <View style={styles.overlay}>
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={styles.loadingText}>Loading stream...</Text>
            </View>
          ) : null}

          {/* Error overlay */}
          {error ? (
            <View style={styles.overlay}>
              <Icon name="error-outline" size={48} color={COLORS.error} />
              <Text style={styles.errorText}>{error}</Text>
              <Text style={styles.urlText}>URL: {videoUrl}</Text>
            </View>
          ) : null}

          {/* Top bar (back + title) */}
          {showControls && !error ? (
            <View style={styles.topBar}>
              <TouchableOpacity
                style={styles.iconBtn}
                onPress={() => navigation.goBack()}>
                <Icon name="arrow-back" size={24} color={COLORS.textPrimary} />
              </TouchableOpacity>
              <Text style={styles.title} numberOfLines={1}>
                {movie.title}
              </Text>
              <View style={{width: 40}} />
            </View>
          ) : null}

          {/* Center play/pause */}
          {showControls && !loading && !error ? (
            <TouchableOpacity
              style={styles.centerBtn}
              onPress={() => setPaused(!paused)}>
              <View style={styles.centerBtnInner}>
                <Icon
                  name={paused ? 'play-arrow' : 'pause'}
                  size={48}
                  color={COLORS.textPrimary}
                />
              </View>
            </TouchableOpacity>
          ) : null}

          {/* Bottom bar (seekbar) */}
          {showControls && !error ? (
            <View style={styles.bottomBar}>
              <TouchableOpacity
                style={styles.iconBtnSmall}
                onPress={() => handleSeek(-10)}>
                <Icon name="replay-10" size={22} color={COLORS.textPrimary} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.iconBtnSmall}
                onPress={() => handleSeek(10)}>
                <Icon name="forward-10" size={22} color={COLORS.textPrimary} />
              </TouchableOpacity>
              <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
              <View style={styles.seekbar}>
                <View style={[styles.seekbarFill, {width: `${progress}%`}]} />
              </View>
              <Text style={styles.timeText}>{formatTime(duration)}</Text>
            </View>
          ) : null}
        </TouchableOpacity>
      </View>
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
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoWrap: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: COLORS.background,
    position: 'relative',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  loadingText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
    marginTop: SPACING.sm,
  },
  errorText: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.md,
    marginTop: SPACING.sm,
    textAlign: 'center',
    paddingHorizontal: SPACING.xl,
  },
  urlText: {
    color: COLORS.textTertiary,
    fontSize: FONT_SIZE.xs,
    marginTop: SPACING.xs,
    textAlign: 'center',
    paddingHorizontal: SPACING.xl,
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    paddingTop: SPACING.lg,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  iconBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold,
    textAlign: 'center',
    marginHorizontal: SPACING.sm,
  },
  centerBtn: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{translateX: -36}, {translateY: -36}],
    width: 72,
    height: 72,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerBtnInner: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    paddingBottom: SPACING.lg,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  iconBtnSmall: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeText: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.xs,
    marginHorizontal: SPACING.xs,
    fontVariant: ['tabular-nums'],
  },
  seekbar: {
    flex: 1,
    height: 4,
    backgroundColor: COLORS.surfaceHover,
    borderRadius: 2,
    marginHorizontal: SPACING.xs,
    overflow: 'hidden',
  },
  seekbarFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
});

export default VideoPlayerScreen;
