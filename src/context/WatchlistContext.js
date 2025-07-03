// src/context/WatchlistContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WatchlistContext = createContext();

export const WatchlistProvider = ({ children }) => {
  const [watchlists, setWatchlists] = useState({}); // Object: { listName: [stocks] }

  useEffect(() => {
    const loadWatchlists = async () => {
      try {
        const stored = await AsyncStorage.getItem('watchlists');
        if (stored) {
          setWatchlists(JSON.parse(stored));
        }
      } catch (err) {
        console.error('Failed to load watchlists:', err);
      }
    };
    loadWatchlists();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('watchlists', JSON.stringify(watchlists));
  }, [watchlists]);

  const addWatchlist = (listName) => {
    if (!listName || watchlists[listName]) return;
    setWatchlists((prev) => ({ ...prev, [listName]: [] }));
  };

  const addStockToWatchlist = (listName, stock) => {
    if (!listName || !stock) return;
    setWatchlists((prev) => {
      const existing = prev[listName] || [];
      if (existing.some((s) => s.symbol === stock.symbol)) return prev; // No duplicates
      return { ...prev, [listName]: [...existing, stock] };
    });
  };

  const removeStockFromWatchlist = (listName, symbol) => {
    if (!listName) return;
    setWatchlists((prev) => {
      const updated = prev[listName]?.filter((s) => s.symbol !== symbol) || [];
      return { ...prev, [listName]: updated };
    });
  };

  const removeWatchlist = (listName) => {
    const updated = { ...watchlists };
    delete updated[listName];
    setWatchlists(updated);
  };

  return (
    <WatchlistContext.Provider
      value={{
        watchlists,
        addWatchlist,
        addStockToWatchlist,
        removeStockFromWatchlist,
        removeWatchlist,
      }}
    >
      {children}
    </WatchlistContext.Provider>
  );
};

// Hook to use the context
export const useWatchlist = () => useContext(WatchlistContext);
;










