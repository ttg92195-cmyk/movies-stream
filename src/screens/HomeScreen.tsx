/**
 * HomeScreen
 * - Hero banner (featured)
 * - Category tabs (Trending / Popular / Top Rated / Now Playing / Upcoming)
 * - Multiple horizontal movie lists
 * - Pull-to-refresh
 */

import React, {useState, useCallback, useEffect} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  RefreshControl,
  SafeAreaView,
} from 'react-native';

import {Movie, MovieCategory, Category} from '../types/movie';
import {TMDBService} from '../services/tmdb';
import {COLORS} from '../theme/colors';
import HeroBanner from '../components/HeroBanner';
import MovieList from '../components/MovieList';
import CategoryTabs from '../components/CategoryTabs';
import LoadingState from '../components/LoadingState';
import ErrorMessage from '../components/ErrorMessage';

import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const CATEGORIES: Category[] = [
  {key: 'trending', label: 'Trending', icon: 'trending-up'},
  {key: 'popular', label: 'Popular', icon: 'people'},
  {key: 'top_rated', label: 'Top Rated', icon: 'star'},
  {key: 'now_playing', label: 'Now Playing', icon: 'play-circle-outline'},
  {key: 'upcoming', label: 'Upcoming', icon: 'schedule'},
];

const HomeScreen: React.FC<Props> = ({navigation}) => {
  const [activeCategory, setActiveCategory] = useState<MovieCategory>('trending');
  const [trending, setTrending] = useState<Movie[]>([]);
  const [popular, setPopular] = useState<Movie[]>([]);
  const [topRated, setTopRated] = useState<Movie[]>([]);
  const [nowPlaying, setNowPlaying] = useState<Movie[]>([]);
  const [upcoming, setUpcoming] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAll = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const [trend, pop, top, now, up] = await Promise.all([
        TMDBService.getByCategory('trending'),
        TMDBService.getByCategory('popular'),
        TMDBService.getByCategory('top_rated'),
        TMDBService.getByCategory('now_playing'),
        TMDBService.getByCategory('upcoming'),
      ]);

      setTrending(trend.results);
      setPopular(pop.results);
      setTopRated(top.results);
      setNowPlaying(now.results);
      setUpcoming(up.results);
    } catch (err: any) {
      const msg =
        err?.response?.data?.status_message ||
        err?.message ||
        'Failed to load movies';
      setError(msg);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const onRefresh = useCallback(() => loadAll(true), [loadAll]);

  const handleMoviePress = (movie: Movie) => {
    navigation.navigate('MovieDetail', {movie});
  };

  const handlePlay = (movie: Movie) => {
    navigation.navigate('VideoPlayer', {movie});
  };

  const getActiveList = (): Movie[] => {
    switch (activeCategory) {
      case 'trending':
        return trending;
      case 'popular':
        return popular;
      case 'top_rated':
        return topRated;
      case 'now_playing':
        return nowPlaying;
      case 'upcoming':
        return upcoming;
    }
  };

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.container}>
          <LoadingState />
        </View>
      </SafeAreaView>
    );
  }

  if (error && trending.length === 0) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.container}>
          <ErrorMessage message={error} onRetry={() => loadAll()} />
        </View>
      </SafeAreaView>
    );
  }

  const featured = trending[0];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
          />
        }>
        {featured ? (
          <HeroBanner
            movie={featured}
            onPlay={handlePlay}
            onMoreInfo={handleMoviePress}
          />
        ) : null}

        <View style={styles.sectionSpacing}>
          <CategoryTabs
            categories={CATEGORIES}
            activeKey={activeCategory}
            onSelect={key => setActiveCategory(key as MovieCategory)}
          />
        </View>

        <MovieList
          title={CATEGORIES.find(c => c.key === activeCategory)?.label || ''}
          movies={getActiveList()}
          onMoviePress={handleMoviePress}
        />

        {/* Always show all sections below for variety */}
        <MovieList
          title="Trending This Week"
          movies={trending}
          onMoviePress={handleMoviePress}
        />
        <MovieList
          title="Popular on MoviesStream"
          movies={popular}
          onMoviePress={handleMoviePress}
        />
        <MovieList
          title="Top Rated"
          movies={topRated}
          onMoviePress={handleMoviePress}
        />
        <MovieList
          title="Now Playing"
          movies={nowPlaying}
          onMoviePress={handleMoviePress}
        />
        <MovieList
          title="Upcoming"
          movies={upcoming}
          onMoviePress={handleMoviePress}
        />

        <View style={styles.bottomSpacer} />
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
    backgroundColor: COLORS.background,
  },
  sectionSpacing: {
    marginTop: 16,
    marginBottom: 8,
  },
  bottomSpacer: {
    height: 40,
  },
});

export default HomeScreen;
