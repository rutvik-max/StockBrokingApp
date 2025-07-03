
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getTopMovers, searchStocks } from '../api/twelveData';
import { useTheme } from '../context/ThemeContext';
import { useWatchlist } from '../context/WatchlistContext';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function ExploreScreen() {
  const [gainers, setGainers] = useState([]);
  const [losers, setLosers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const { colors, toggleTheme, isDark } = useTheme();
  const { addStockToWatchlist } = useWatchlist();
  const navigation = useNavigation();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const { gainers, losers } = await getTopMovers();
      setGainers(gainers);
      setLosers(losers);
    } catch (err) {
      console.error('Failed to load top movers:', err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleSearch = async (text) => {
    setSearch(text);
    if (text.length > 1) {
      try {
        const results = await searchStocks(text);
        setSearchResults(results);
      } catch (err) {
        console.error('Search failed:', err.message);
        setSearchResults([]);
      }
    } else {
      setSearchResults([]);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card }]}
      onPress={() => navigation.navigate('Product', { item })}
    >
      <View>
        <Text style={[styles.symbol, { color: colors.text }]}>{item.symbol}</Text>
        <Text style={[styles.price, { color: colors.text }]}>${item.price}</Text>
        <Text
          style={[
            styles.change,
            { color: parseFloat(item.change) >= 0 ? '#2ecc71' : '#e74c3c' },
          ]}
        >
          {item.change} ({item.changePercent}%)
        </Text>
      </View>

      <TouchableOpacity
        onPress={() => addStockToWatchlist('Default', { symbol: item.symbol, price: item.price })}
        style={styles.addButton}
      >
        <Ionicons name="add-circle" size={22} color={colors.primary} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Theme Toggle */}
      <TouchableOpacity onPress={toggleTheme} style={styles.themeToggle}>
        <Text style={{ color: colors.primary }}>
          Switch to {isDark ? 'Light' : 'Dark'} Mode
        </Text>
      </TouchableOpacity>

      {/* Search Bar */}
      <TextInput
        style={[styles.searchBar, { backgroundColor: colors.card, color: colors.text }]}
        placeholder="Search stocks..."
        placeholderTextColor={colors.placeholder || '#888'}
        value={search}
        onChangeText={handleSearch}
      />

      {/* Search Results */}
      {search.length > 0 && (
        <>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Search Results</Text>
          <FlatList
            data={searchResults}
            keyExtractor={(item) => `search-${item.symbol}`}
            renderItem={renderItem}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </>
      )}

      {/* Top Gainers */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Top Gainers</Text>
        <TouchableOpacity onPress={() => navigation.navigate('ViewAll', { section: 'Gainers', stocks: gainers })}>
          <Text style={[styles.viewAll, { color: colors.primary }]}>View All</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={gainers}
        keyExtractor={(item) => `gainer-${item.symbol}`}
        renderItem={renderItem}
        horizontal
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsHorizontalScrollIndicator={false}
      />

      {/* Top Losers */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Top Losers</Text>
        <TouchableOpacity onPress={() => navigation.navigate('ViewAll', { section: 'Losers', stocks: losers })}>
          <Text style={[styles.viewAll, { color: colors.primary }]}>View All</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={losers}
        keyExtractor={(item) => `loser-${item.symbol}`}
        renderItem={renderItem}
        horizontal
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingVertical: 12, paddingHorizontal: 16 },
  themeToggle: { alignSelf: 'flex-end', marginBottom: 12 },
  searchBar: { borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, fontSize: 16, marginBottom: 12 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, marginBottom: 8 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold' },
  viewAll: { fontSize: 14, fontWeight: 'bold' },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    marginRight: 12,
    borderRadius: 12,
    width: 180,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  symbol: { fontSize: 16, fontWeight: 'bold' },
  price: { fontSize: 14, marginTop: 4 },
  change: { fontSize: 13, marginTop: 4 },
  addButton: { alignSelf: 'center' },
});



































