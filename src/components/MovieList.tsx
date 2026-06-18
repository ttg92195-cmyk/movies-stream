/**
 * MovieList — Horizontal scroll list of MovieCards
 */

import React from 'react';
import {View, Text, FlatList, StyleSheet, ActivityIndicator} from 'react-native';

import {Movie} from '../types/movie';
import MovieCard from './MovieCard';
import {COLORS, SPACING, FONT_SIZE, FONT_WEIGHT} from '../theme/colors';

interface MovieListProps {
  title: string;
  movies: Movie[];
  loading?: boolean;
  onMoviePress: (movie: Movie) => void;
  onSeeAll?: () => void;
}

const MovieList: React.FC<MovieListProps> = ({
  title,
  movies,
  loading,
  onMoviePress,
  onSeeAll,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {onSeeAll ? (
          <Text style={styles.seeAll} onPress={onSeeAll}>
            See All
          </Text>
        ) : null}
      </View>
      {loading ? (
        <ActivityIndicator
          color={COLORS.primary}
          size="large"
          style={styles.loader}
        />
      ) : (
        <FlatList
          horizontal
          data={movies}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) => (
            <MovieCard movie={item} onPress={onMoviePress} />
          )}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.list}
          initialNumToRender={5}
          maxToRenderPerBatch={10}
          windowSize={7}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
  },
  seeAll: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.medium,
  },
  list: {
    paddingHorizontal: SPACING.lg,
  },
  loader: {
    height: 210,
  },
});

export default MovieList;
