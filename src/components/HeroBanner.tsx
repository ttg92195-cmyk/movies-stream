/**
 * HeroBanner — Featured movie banner with backdrop & play button
 */

import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Pressable,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {Movie} from '../types/movie';
import {getImageUrl, BACKDROP_SIZES} from '../services/tmdb';
import {COLORS, SPACING, RADIUS, FONT_SIZE, FONT_WEIGHT} from '../theme/colors';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

interface HeroBannerProps {
  movie: Movie;
  onPlay: (movie: Movie) => void;
  onMoreInfo: (movie: Movie) => void;
}

const HeroBanner: React.FC<HeroBannerProps> = ({movie, onPlay, onMoreInfo}) => {
  return (
    <Pressable
      style={styles.container}
      onPress={() => onMoreInfo(movie)}>
      <Image
        source={{
          uri: getImageUrl(movie.backdrop_path, BACKDROP_SIZES.original),
        }}
        style={styles.backdrop}
        resizeMode="cover"
      />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.3)', COLORS.background]}
        style={styles.gradient}
      />
      <View style={styles.content}>
        <Text style={styles.badge}>FEATURED</Text>
        <Text style={styles.title} numberOfLines={2}>
          {movie.title}
        </Text>
        <Text style={styles.overview} numberOfLines={2}>
          {movie.overview}
        </Text>
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.playBtn}
            onPress={() => onPlay(movie)}>
            <Icon name="play-arrow" size={22} color={COLORS.textInverse} />
            <Text style={styles.playText}>Play</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.infoBtn}
            onPress={() => onMoreInfo(movie)}>
            <Icon
              name="info-outline"
              size={20}
              color={COLORS.textPrimary}
            />
            <Text style={styles.infoText}>More Info</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 0.62, // ~16:9
    position: 'relative',
  },
  backdrop: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '70%',
  },
  content: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: SPACING.lg,
  },
  badge: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.bold,
    letterSpacing: 1.5,
    marginBottom: SPACING.xs,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.xxxl,
    fontWeight: FONT_WEIGHT.heavy,
    marginBottom: SPACING.xs,
    maxWidth: '80%',
  },
  overview: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
    lineHeight: 20,
    maxWidth: '85%',
    marginBottom: SPACING.md,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.textPrimary,
    paddingHorizontal: SPACING.lg + 4,
    paddingVertical: SPACING.sm + 2,
    borderRadius: RADIUS.sm,
    marginRight: SPACING.sm,
  },
  playText: {
    color: COLORS.textInverse,
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.bold,
    marginLeft: SPACING.xs,
  },
  infoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.overlayLight,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm + 2,
    borderRadius: RADIUS.sm,
  },
  infoText: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold,
    marginLeft: SPACING.xs,
  },
});

export default HeroBanner;
