// src/screens/ViewAllScreen.js
import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';

export default function ViewAllScreen() {
  const { colors, toggleTheme, isDark } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const { section, stocks } = route.params;

  const [page, setPage] = useState(1);
  const pageSize = 10;
  const paginatedStocks = stocks.slice(0, page * pageSize);
  const hasMore = paginatedStocks.length < stocks.length;

  const loadMore = () => setPage(page + 1);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card }]}
      onPress={() => navigation.navigate('Product', { item })}
    >
      <Text style={[styles.symbol, { color: colors.text }]}>{item.symbol}</Text>
      <Text style={[styles.price, { color: colors.text }]}>${item.price}</Text>
      <Text
        style={[
          styles.change,
          { color: parseFloat(item.change) >= 0 ? 'green' : 'red' },
        ]}
      >
        {item.change} ({item.changePercent}%)
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Theme toggle */}
      <TouchableOpacity onPress={toggleTheme} style={styles.themeToggle}>
        <Text style={{ color: colors.primary }}>
          Switch to {isDark ? 'Light' : 'Dark'} Mode
        </Text>
      </TouchableOpacity>

      <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 12 }]}>
        {section} Stocks
      </Text>

      <FlatList
        data={paginatedStocks}
        keyExtractor={(item) => `${section}-${item.symbol}`}
        renderItem={renderItem}
        ListFooterComponent={
          hasMore ? (
            <TouchableOpacity onPress={loadMore} style={styles.loadMoreButton}>
              <Text style={{ color: colors.primary }}>Load More</Text>
            </TouchableOpacity>
          ) : (
            <Text style={{ textAlign: 'center', marginTop: 12, color: colors.placeholder || '#888' }}>
              End of Results
            </Text>
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  themeToggle: { alignSelf: 'flex-end', marginBottom: 12 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold' },
  card: { padding: 12, marginBottom: 10, borderRadius: 12, elevation: 2 },
  symbol: { fontSize: 16, fontWeight: 'bold' },
  price: { fontSize: 14, marginTop: 4 },
  change: { fontSize: 13, marginTop: 4 },
  loadMoreButton: { padding: 12, alignItems: 'center' },
});

