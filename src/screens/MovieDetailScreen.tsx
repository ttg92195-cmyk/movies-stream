/**
 * MovieDetailScreen
 * - Backdrop hero with title, rating, runtime
 * - Play & Favorite buttons
 * - Synopsis, genres, release date
 */

import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {Movie} from '../types/movie';
import {TMDBService, getImageUrl, BACKDROP_SIZES, POSTER_SIZES} from '../services/tmdb';
import {FavoritesService} from '../services/storage';
import {COLORS, SPACING, RADIUS, FONT_SIZE, FONT_WEIGHT, SHADOWS} from '../theme/colors';
import LoadingState from '../components/LoadingState';
import ErrorMessage from '../components/ErrorMessage';

import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'MovieDetail'>;

const {width: SCREEN_WIDTH} = Dimensions.get('window');

const MovieDetailScreen: React.FC<Props> = ({route, navigation}) => {
  const initialMovie = route.params.movie;
  const [movie, setMovie] = useState<Movie>(initialMovie);
  const [loading, setLoading] = useState(!initialMovie.genres);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  const loadDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const details = await TMDBService.getMovieDetails(initialMovie.id);
      setMovie(details);
    } catch (err: any) {
      // Keep using the initial movie data we already have
      setError(null);
    } finally {
      setLoading(false);
    }
  }, [initialMovie.id]);

  const checkFavorite = useCallback(async () => {
    const fav = await FavoritesService.isFavorite(initialMovie.id);
    setIsFavorite(fav);
  }, [initialMovie.id]);

  useEffect(() => {
    if (!initialMovie.genres) {
      loadDetails();
    }
    checkFavorite();
  }, [loadDetails, checkFavorite, initialMovie.genres]);

  const handlePlay = () => {
    navigation.navigate('VideoPlayer', {movie});
  };

  const handleToggleFavorite = async () => {
    const newFav = await FavoritesService.toggle(movie);
    setIsFavorite(newFav);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <LoadingState />
      </SafeAreaView>
    );
  }

  const year = movie.release_date ? movie.release_date.substring(0, 4) : 'N/A';
  const runtimeText =
    movie.runtime && movie.runtime > 0
      ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
      : null;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}>
        {/* Backdrop Hero */}
        <View style={styles.heroWrap}>
          <Image
            source={{
              uri: getImageUrl(movie.backdrop_path, BACKDROP_SIZES.original),
            }}
            style={styles.backdrop}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['transparent', COLORS.background]}
            style={styles.gradient}
          />
          <View style={styles.heroContent}>
            <Text style={styles.title} numberOfLines={3}>
              {movie.title}
            </Text>
            <View style={styles.metaRow}>
              <View style={styles.ratingChip}>
                <Icon name="star" size={14} color={COLORS.warning} />
                <Text style={styles.metaText}>
                  {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
                </Text>
              </View>
              <Text style={styles.metaText}>{year}</Text>
              {runtimeText ? <Text style={styles.metaText}>{runtimeText}</Text> : null}
              {movie.vote_count ? (
                <Text style={styles.metaTextFaint}>
                  {movie.vote_count.toLocaleString()} votes
                </Text>
              ) : null}
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.playBtn} onPress={handlePlay}>
            <Icon name="play-arrow" size={24} color={COLORS.textInverse} />
            <Text style={styles.playText}>Play Now</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.favBtn}
            onPress={handleToggleFavorite}>
            <Icon
              name={isFavorite ? 'favorite' : 'favorite-border'}
              size={22}
              color={isFavorite ? COLORS.primary : COLORS.textPrimary}
            />
            <Text
              style={[
                styles.favText,
                isFavorite && styles.favTextActive,
              ]}>
              {isFavorite ? 'Added' : 'My List'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Genres */}
        {movie.genres && movie.genres.length > 0 ? (
          <View style={styles.section}>
            <View style={styles.genreRow}>
              {movie.genres.map(g => (
                <View key={g.id} style={styles.genreChip}>
                  <Text style={styles.genreText}>{g.name}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        {/* Synopsis */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Synopsis</Text>
          <Text style={styles.synopsis}>
            {movie.overview || 'No synopsis available for this movie.'}
          </Text>
        </View>

        {/* Tagline */}
        {movie.tagline ? (
          <View style={styles.section}>
            <Text style={styles.tagline}>"{movie.tagline}"</Text>
          </View>
        ) : null}

        {/* Poster (small, at bottom for reference) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Poster</Text>
          <View style={styles.posterRow}>
            <Image
              source={{
                uri: getImageUrl(movie.poster_path, POSTER_SIZES.medium),
              }}
              style={styles.poster}
              resizeMode="cover"
            />
            <View style={styles.posterMeta}>
              <Text style={styles.posterMetaLabel}>Title</Text>
              <Text style={styles.posterMetaValue}>{movie.title}</Text>
              <Text style={styles.posterMetaLabel}>Release Date</Text>
              <Text style={styles.posterMetaValue}>
                {movie.release_date || 'Unknown'}
              </Text>
              <Text style={styles.posterMetaLabel}>Rating</Text>
              <Text style={styles.posterMetaValue}>
                {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'} / 10
              </Text>
            </View>
          </View>
        </View>

        <View style={{height: 40}} />
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
  heroWrap: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 0.6,
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
    height: '60%',
  },
  heroContent: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: SPACING.lg,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.xxxl,
    fontWeight: FONT_WEIGHT.heavy,
    maxWidth: '90%',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.sm,
    flexWrap: 'wrap',
  },
  ratingChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.overlayDark,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
    marginRight: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  metaText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
    marginRight: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  metaTextFaint: {
    color: COLORS.textTertiary,
    fontSize: FONT_SIZE.xs,
    marginBottom: SPACING.xs,
  },
  actions: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  playBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.textPrimary,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    marginRight: SPACING.sm,
  },
  playText: {
    color: COLORS.textInverse,
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.bold,
    marginLeft: SPACING.xs,
  },
  favBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surfaceElevated,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  favText: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold,
    marginLeft: SPACING.xs,
  },
  favTextActive: {
    color: COLORS.primary,
  },
  section: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  sectionTitle: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
    marginBottom: SPACING.sm,
  },
  genreRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  genreChip: {
    backgroundColor: COLORS.surfaceElevated,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: RADIUS.pill,
    marginRight: SPACING.sm,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  genreText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.medium,
  },
  synopsis: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.md,
    lineHeight: 22,
  },
  tagline: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.md,
    fontStyle: 'italic',
    lineHeight: 22,
  },
  posterRow: {
    flexDirection: 'row',
  },
  poster: {
    width: 100,
    height: 150,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surface,
  },
  posterMeta: {
    flex: 1,
    marginLeft: SPACING.lg,
  },
  posterMetaLabel: {
    color: COLORS.textTertiary,
    fontSize: FONT_SIZE.xs,
    marginTop: SPACING.sm,
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  posterMetaValue: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.medium,
  },
});

export default MovieDetailScreen;
