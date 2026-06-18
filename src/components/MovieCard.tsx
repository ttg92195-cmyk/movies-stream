/**
 * MovieCard — Poster card with title overlay & rating badge
 */

import React from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {Movie} from '../types/movie';
import {getImageUrl, POSTER_SIZES} from '../services/tmdb';
import {COLORS, SPACING, RADIUS, FONT_SIZE, FONT_WEIGHT, SHADOWS} from '../theme/colors';

interface MovieCardProps {
  movie: Movie;
  onPress: (movie: Movie) => void;
  width?: number;
}

const MovieCard: React.FC<MovieCardProps> = ({movie, onPress, width = 140}) => {
  const height = width * 1.5; // 2:3 poster aspect ratio

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onPress(movie)}
      style={[styles.container, {width}]}>
      <View style={[styles.posterWrap, {height}, SHADOWS.card]}>
        <Image
          source={{uri: getImageUrl(movie.poster_path, POSTER_SIZES.medium)}}
          style={styles.poster}
          resizeMode="cover"
        />
        {/* Rating Badge */}
        <View style={styles.ratingBadge}>
          <Icon name="star" size={11} color={COLORS.warning} />
          <Text style={styles.ratingText}>
            {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
          </Text>
        </View>
      </View>
      <Text style={styles.title} numberOfLines={2}>
        {movie.title}
      </Text>
      {movie.release_date ? (
        <Text style={styles.year}>
          {movie.release_date.substring(0, 4)}
        </Text>
      ) : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginRight: SPACING.md,
  },
  posterWrap: {
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    backgroundColor: COLORS.surface,
    position: 'relative',
  },
  poster: {
    width: '100%',
    height: '100%',
  },
  ratingBadge: {
    position: 'absolute',
    top: SPACING.xs,
    right: SPACING.xs,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.overlayDark,
    paddingHorizontal: SPACING.xs + 2,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
  },
  ratingText: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.micro,
    fontWeight: FONT_WEIGHT.bold,
    marginLeft: 2,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.medium,
    marginTop: SPACING.xs,
    lineHeight: 18,
  },
  year: {
    color: COLORS.textTertiary,
    fontSize: FONT_SIZE.xs,
    marginTop: 2,
  },
});

export default MovieCard;
