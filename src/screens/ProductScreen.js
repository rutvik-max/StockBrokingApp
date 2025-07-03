import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  TextInput,
  FlatList,
  ScrollView,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useTheme } from '../context/ThemeContext';
import { useWatchlist } from '../context/WatchlistContext';
import { getStockChartData, getCompanyProfile } from '../api/twelveData';
import Ionicons from 'react-native-vector-icons/Ionicons';

const intervals = ['15min', '1day', '1week', '1month'];

export default function ProductScreen({ route }) {
  const { item } = route.params;
  const { colors } = useTheme();
  const { watchlists, addWatchlist, addStockToWatchlist } = useWatchlist();

  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [interval, setInterval] = useState('15min');
  const [modalVisible, setModalVisible] = useState(false);
  const [newWatchlistName, setNewWatchlistName] = useState('');
  const [isInWatchlist, setIsInWatchlist] = useState(false);

  useEffect(() => {
    loadChart();
    loadProfile();
  }, [interval]);

  useEffect(() => {
    checkIfInWatchlist();
  }, [watchlists]);

  const loadChart = async () => {
    try {
      setLoading(true);
      const data = await getStockChartData(item.symbol, interval);
      setChartData(data.length ? data : fallbackChartData);
    } catch {
      setChartData(fallbackChartData);
    } finally {
      setLoading(false);
    }
  };

  const loadProfile = async () => {
    try {
      const data = await getCompanyProfile(item.symbol);
      if (data) setProfile(data);
    } catch {
      setProfile(null);
    }
  };

  const fallbackChartData = [
    { datetime: '10:00', close: 100 },
    { datetime: '10:05', close: 102 },
    { datetime: '10:10', close: 101 },
    { datetime: '10:15', close: 103 },
  ];

  const checkIfInWatchlist = () => {
    const found = Object.values(watchlists).some((stocks) =>
      stocks.some((s) => s.symbol === item.symbol)
    );
    setIsInWatchlist(found);
  };

  const handleAddToWatchlist = (watchlistName) => {
    addStockToWatchlist(watchlistName, { symbol: item.symbol, price: item.price });
    setModalVisible(false);
  };

  const handleCreateNewWatchlist = () => {
    if (newWatchlistName.trim()) {
      addWatchlist(newWatchlistName);
      addStockToWatchlist(newWatchlistName, { symbol: item.symbol, price: item.price });
      setNewWatchlistName('');
      setModalVisible(false);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.symbol, { color: colors.text }]}>{item.symbol}</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Ionicons
            name={isInWatchlist ? 'bookmark' : 'bookmark-outline'}
            size={26}
            color={colors.primary}
          />
        </TouchableOpacity>
      </View>

      <Text style={[styles.price, { color: colors.text }]}>${item.price}</Text>

      {profile ? (
        <View style={{ marginVertical: 12 }}>
          <Text style={[styles.profileText, { color: colors.text }]}>Company: {profile.name}</Text>
          <Text style={[styles.profileText, { color: colors.text }]}>Exchange: {profile.exchange}</Text>
          <Text style={[styles.profileText, { color: colors.text }]}>Industry: {profile.industry}</Text>
        </View>
      ) : (
        <Text style={[styles.profileText, { color: colors.text }]}>Loading profile...</Text>
      )}

      <View style={styles.intervalContainer}>
        {intervals.map((int) => (
          <TouchableOpacity
            key={int}
            style={[
              styles.intervalButton,
              { backgroundColor: interval === int ? colors.primary : colors.card },
            ]}
            onPress={() => setInterval(int)}
          >
            <Text
              style={{
                color: interval === int ? colors.background : colors.text,
                fontWeight: 'bold',
              }}
            >
              {int}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
      ) : (
        <LineChart
          data={{
            labels: chartData.map((d, index) =>
              index % 3 === 0 ? (d.datetime.split(' ')[1] || d.datetime) : ''
            ),
            datasets: [{ data: chartData.map((d) => d.close) }],
          }}
          width={340}
          height={220}
          chartConfig={{
            backgroundColor: colors.background,
            backgroundGradientFrom: colors.background,
            backgroundGradientTo: colors.background,
            decimalPlaces: 2,
            color: () => colors.primary,
            labelColor: () => colors.text,
            propsForLabels: { fontSize: 10 },
          }}
          bezier
          style={{ marginVertical: 12, borderRadius: 12 }}
        />
      )}

      {/* Watchlist Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Add to Watchlist</Text>

            <FlatList
              data={Object.keys(watchlists)}
              keyExtractor={(name) => name}
              renderItem={({ item: watchlistName }) => (
                <TouchableOpacity onPress={() => handleAddToWatchlist(watchlistName)}>
                  <Text style={[styles.listItem, { color: colors.primary }]}>{watchlistName}</Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <Text style={[styles.empty, { color: colors.placeholder }]}>No watchlists yet</Text>
              }
            />

            <TextInput
              style={[styles.input, { color: colors.text, borderColor: colors.primary }]}
              placeholder="New watchlist name"
              placeholderTextColor={colors.placeholder}
              value={newWatchlistName}
              onChangeText={setNewWatchlistName}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={handleCreateNewWatchlist}>
                <Text style={{ color: colors.primary, marginRight: 20 }}>Create & Add</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={{ color: colors.primary }}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  symbol: { fontSize: 24, fontWeight: 'bold' },
  price: { fontSize: 20, marginTop: 8 },
  profileText: { fontSize: 14, marginTop: 4 },
  intervalContainer: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 12 },
  intervalButton: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6 },
  empty: { marginTop: 20, textAlign: 'center' },
  modalContainer: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { margin: 20, padding: 20, borderRadius: 8 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  listItem: { paddingVertical: 8, fontSize: 16 },
  input: { borderWidth: 1, borderRadius: 6, padding: 8, marginTop: 12 },
  modalButtons: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16 },
});















