/**
 * FavoritesScreen
 * - Grid of favorited movies (stored locally)
 * - Pull-to-refresh
 * - Clear all option
 */

import React, {useState, useCallback, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {FavoriteItem, Movie} from '../types/movie';
import {FavoritesService} from '../services/storage';
import {getImageUrl, POSTER_SIZES} from '../services/tmdb';
import {COLORS, SPACING, RADIUS, FONT_SIZE, FONT_WEIGHT, SHADOWS} from '../theme/colors';
import EmptyState from '../components/EmptyState';
import LoadingState from '../components/LoadingState';

import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'MovieDetail'>;

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const COLUMN_WIDTH = (SCREEN_WIDTH - SPACING.lg * 3) / 2;

const FavoritesScreen: React.FC<Props> = ({navigation}) => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadFavorites = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      const list = await FavoritesService.getAll();
      setFavorites(list);
    } catch (err) {
      console.error('Failed to load favorites:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadFavorites();
    });
    return unsubscribe;
  }, [navigation, loadFavorites]);

  const handleMoviePress = (item: FavoriteItem) => {
    const movie: Movie = {
      id: item.id,
      title: item.title,
      overview: '',
      poster_path: item.poster_path,
      backdrop_path: null,
      release_date: item.release_date,
      vote_average: item.vote_average,
      vote_count: 0,
    };
    navigation.navigate('MovieDetail', {movie});
  };

  const handleRemove = async (id: number) => {
    await FavoritesService.remove(id);
    loadFavorites();
  };

  const handleClearAll = async () => {
    await FavoritesService.clear();
    setFavorites([]);
  };

  const renderItem = ({item}: {item: FavoriteItem}) => (
    <View style={styles.cardWrap}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => handleMoviePress(item)}
        style={styles.card}>
        <View style={[styles.posterWrap, SHADOWS.card]}>
          {item.poster_path ? (
            <Image
              source={{
                uri: getImageUrl(item.poster_path, POSTER_SIZES.medium),
              }}
              style={styles.poster}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.poster, styles.noPoster]}>
              <Icon name="movie" size={40} color={COLORS.textTertiary} />
            </View>
          )}
          <View style={styles.ratingBadge}>
            <Icon name="star" size={11} color={COLORS.warning} />
            <Text style={styles.ratingText}>
              {item.vote_average ? item.vote_average.toFixed(1) : 'N/A'}
            </Text>
          </View>
        </View>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
        {item.release_date ? (
          <Text style={styles.year}>{item.release_date.substring(0, 4)}</Text>
        ) : null}
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.removeBtn}
        onPress={() => handleRemove(item.id)}>
        <Icon name="close" size={16} color={COLORS.textPrimary} />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Favorites</Text>
        {favorites.length > 0 ? (
          <TouchableOpacity onPress={handleClearAll} style={styles.clearBtn}>
            <Icon name="delete-sweep" size={18} color={COLORS.textSecondary} />
            <Text style={styles.clearText}>Clear All</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {loading ? (
        <LoadingState />
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={item => item.id.toString()}
          numColumns={2}
          contentContainerStyle={
            favorites.length === 0 ? styles.emptyList : styles.list
          }
          columnWrapperStyle={styles.column}
          renderItem={renderItem}
          ListEmptyComponent={
            <EmptyState
              icon="favorite-border"
              title="No Favorites Yet"
              subtitle="Tap the heart icon on any movie to add it to your favorites list."
            />
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => loadFavorites(true)}
              tintColor={COLORS.primary}
              colors={[COLORS.primary]}
            />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

import {Image} from 'react-native';

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  headerTitle: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.xxxl,
    fontWeight: FONT_WEIGHT.heavy,
  },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.xs,
  },
  clearText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
    marginLeft: 4,
  },
  list: {
    padding: SPACING.lg,
  },
  emptyList: {
    flex: 1,
  },
  column: {
    marginBottom: SPACING.lg,
  },
  cardWrap: {
    position: 'relative',
  },
  card: {
    width: COLUMN_WIDTH,
  },
  posterWrap: {
    width: COLUMN_WIDTH,
    height: COLUMN_WIDTH * 1.5,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    backgroundColor: COLORS.surface,
    position: 'relative',
  },
  poster: {
    width: '100%',
    height: '100%',
  },
  noPoster: {
    justifyContent: 'center',
    alignItems: 'center',
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
  removeBtn: {
    position: 'absolute',
    top: SPACING.xs,
    left: SPACING.xs,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FavoritesScreen;
