/**
 * SearchScreen
 * - Search input + genre filter dropdown
 * - Results grid (2 columns)
 * - Recent search history ( AsyncStorage )
 */

import React, {useState, useCallback, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';

import {Movie, Genre} from '../types/movie';
import {TMDBService} from '../services/tmdb';
import {COLORS, SPACING, RADIUS, FONT_SIZE, FONT_WEIGHT} from '../theme/colors';
import SearchBar from '../components/SearchBar';
import CategoryTabs from '../components/CategoryTabs';
import MovieCard from '../components/MovieCard';
import EmptyState from '../components/EmptyState';
import LoadingState from '../components/LoadingState';

import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Search'>;

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const COLUMN_WIDTH = (SCREEN_WIDTH - SPACING.lg * 3) / 2;

const SearchScreen: React.FC<Props> = ({navigation}) => {
  const [query, setQuery] = useState('');
  const [genres, setGenres] = useState<Genre[]>([]);
  const [activeGenre, setActiveGenre] = useState<number | null>(null);
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [searching, setSearching] = useState(false);

  // Load genres on mount
  useEffect(() => {
    const loadGenres = async () => {
      try {
        const data = await TMDBService.getGenres();
        setGenres(data);
      } catch (err) {
        console.error('Failed to load genres:', err);
      } finally {
        setInitialLoading(false);
      }
    };
    loadGenres();
  }, []);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setSearching(false);
      return;
    }

    setSearching(true);
    const timer = setTimeout(async () => {
      try {
        const data = await TMDBService.searchMovies(query.trim());
        setResults(data.results);
      } catch (err) {
        console.error('Search failed:', err);
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  // Filter by genre
  const loadByGenre = useCallback(async (genreId: number) => {
    try {
      setLoading(true);
      const data = await TMDBService.getByGenre(genreId);
      setResults(data.results);
    } catch (err) {
      console.error('Genre filter failed:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleGenreSelect = (key: string) => {
    const genreId = parseInt(key, 10);
    if (activeGenre === genreId) {
      // Toggle off
      setActiveGenre(null);
      setResults([]);
      setQuery('');
      return;
    }
    setActiveGenre(genreId);
    setQuery('');
    loadByGenre(genreId);
  };

  const handleMoviePress = (movie: Movie) => {
    navigation.navigate('MovieDetail', {movie});
  };

  const renderEmpty = () => {
    if (searching || loading) {
      return <LoadingState />;
    }
    if (!query && !activeGenre) {
      return (
        <EmptyState
          icon="search"
          title="Search for Movies"
          subtitle="Find your favorite movies by title, or filter by genre below."
        />
      );
    }
    return (
      <EmptyState
        icon="movie-filter"
        title="No Results Found"
        subtitle="Try a different search term or genre."
      />
    );
  };

  const genreTabs = genres.map(g => ({key: g.id.toString(), label: g.name}));

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Search</Text>
        <SearchBar
          value={query}
          onChangeText={text => {
            setQuery(text);
            setActiveGenre(null);
          }}
          loading={searching}
          onClear={() => {
            setQuery('');
            setResults([]);
          }}
        />
      </View>

      {genreTabs.length > 0 ? (
        <CategoryTabs
          categories={genreTabs}
          activeKey={activeGenre ? activeGenre.toString() : ''}
          onSelect={handleGenreSelect}
          style={{marginTop: SPACING.sm}}
        />
      ) : null}

      {initialLoading ? (
        <LoadingState />
      ) : (
        <FlatList
          data={results}
          keyExtractor={item => item.id.toString()}
          numColumns={2}
          contentContainerStyle={
            results.length === 0 ? styles.emptyList : styles.list
          }
          columnWrapperStyle={styles.column}
          renderItem={({item}) => (
            <MovieCard
              movie={item}
              onPress={handleMoviePress}
              width={COLUMN_WIDTH}
            />
          )}
          ListEmptyComponent={renderEmpty}
          showsVerticalScrollIndicator={false}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.sm,
  },
  headerTitle: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.xxxl,
    fontWeight: FONT_WEIGHT.heavy,
    marginBottom: SPACING.md,
  },
  list: {
    padding: SPACING.lg,
  },
  emptyList: {
    flex: 1,
  },
  column: {
    marginBottom: SPACING.md,
  },
});

export default SearchScreen;
