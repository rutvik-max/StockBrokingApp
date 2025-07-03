//// src/screens/WatchlistScreen.js
  import React from 'react';
  import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Alert,
  } from 'react-native';
  import { useWatchlist } from '../context/WatchlistContext';
  import { useTheme } from '../context/ThemeContext';

  export default function WatchlistScreen({ navigation }) {
    const { watchlists, removeStockFromWatchlist, removeWatchlist } = useWatchlist();
    const { colors } = useTheme();

    const renderStockItem = (watchlistName) => ({ item }) => (
      <TouchableOpacity
        style={[styles.stockCard, { backgroundColor: colors.card }]}
        onPress={() => navigation.navigate('Product', { item })}
      >
        <View>
          <Text style={[styles.symbol, { color: colors.text }]}>{item.symbol}</Text>
          <Text style={[styles.price, { color: colors.text }]}>${parseFloat(item.price).toFixed(2)}</Text>
        </View>

        <TouchableOpacity
          onPress={() => {
            Alert.alert(
              'Remove Stock',
              `Remove ${item.symbol} from "${watchlistName}"?`,
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Remove', onPress: () => removeStockFromWatchlist(watchlistName, item.symbol) },
              ]
            );
          }}
        >
          <Text style={[styles.remove, { color: 'red' }]}>Remove</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );

    const renderWatchlist = ({ item: watchlistName }) => {
      const stocks = watchlists[watchlistName];
      const totalValue = stocks.reduce((sum, s) => sum + parseFloat(s.price || 0), 0);

      return (
        <View key={watchlistName} style={styles.watchlistContainer}>
          <View style={styles.watchlistHeader}>
            <Text style={[styles.watchlistTitle, { color: colors.primary }]}>{watchlistName}</Text>
            <TouchableOpacity
              onPress={() => {
                Alert.alert(
                  'Delete Watchlist',
                  `Are you sure you want to delete "${watchlistName}"?`,
                  [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Delete', onPress: () => removeWatchlist(watchlistName) },
                  ]
                );
              }}
            >
              <Text style={[styles.deleteList, { color: 'red' }]}>Delete</Text>
            </TouchableOpacity>
          </View>

          <Text style={[styles.summary, { color: colors.placeholder }]}>
            {stocks.length} stock(s), total value: ${totalValue.toFixed(2)}
          </Text>

          {stocks.length === 0 ? (
            <Text style={[styles.empty, { color: colors.placeholder }]}>No stocks in this list.</Text>
          ) : (
            <FlatList
              data={stocks}
              keyExtractor={(item) => item.symbol}
              renderItem={renderStockItem(watchlistName)}
              style={{ marginTop: 8 }}
            />
          )}
        </View>
      );
    };

    const watchlistNames = Object.keys(watchlists);

    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.text }]}>My Watchlists</Text>

        {watchlistNames.length === 0 ? (
          <Text style={[styles.empty, { color: colors.text }]}>You have no watchlists yet.</Text>
        ) : (
          <FlatList
            data={watchlistNames}
            keyExtractor={(name) => name}
            renderItem={renderWatchlist}
          />
        )}
      </View>
    );
  }

  const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 16 },
    watchlistContainer: { marginBottom: 24 },
    watchlistHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    watchlistTitle: { fontSize: 20, fontWeight: 'bold' },
    deleteList: { fontSize: 14 },
    summary: { fontSize: 13, marginTop: 2 },
    stockCard: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 12,
      marginBottom: 8,
      borderRadius: 8,
      elevation: 2,
      shadowColor: '#000',
      shadowOpacity: 0.05,
      shadowRadius: 4,
    },
    symbol: { fontSize: 16, fontWeight: 'bold' },
    price: { fontSize: 14, marginTop: 2 },
    remove: { fontWeight: 'bold', fontSize: 13, marginLeft: 8 },
    empty: { marginTop: 8, fontSize: 14 },
  });








