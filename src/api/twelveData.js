import axios from 'axios';

const API_KEY = '29886bd4fe73470b84ea3afec3376d2e';
const BASE_URL = 'https://api.twelvedata.com';

// Get Top Movers
export const getTopMovers = async () => {
  try {
    // Add more symbols
    const symbols = [
      'AAPL', 'MSFT', 'GOOG', 'AMZN', 'META', 'TSLA', 'NFLX', 'NVDA', 'BABA', 'INTC',
      'AMD', 'CRM', 'ORCL', 'PYPL', 'UBER', 'LYFT', 'SHOP', 'SQ', 'ZM', 'PINS'
    ];


    const responses = await Promise.all(
      symbols.map(async (symbol) => {
        try {
          const res = await axios.get(`${BASE_URL}/quote`, {
            params: { symbol, apikey: API_KEY },
          });
          const d = res.data;
          if (!d || d.status === 'error' || !d.symbol) {
            console.warn(`No valid data for ${symbol}:`, d.message || 'Unknown error');
            return null;
          }
          return {
            symbol: d.symbol,
            name: d.name || symbol,
            price: d.close || '0.00',
            change: d.change || '0.00',
            changePercent: d.percent_change || '0.00',
            time: d.datetime,
          };
        } catch (err) {
          console.error(`Error fetching ${symbol}:`, err.message);
          return null;
        }
      })
    );

    const validStocks = responses.filter(Boolean);
    const gainers = validStocks.filter((s) => parseFloat(s.change) > 0);
    const losers = validStocks.filter((s) => parseFloat(s.change) < 0);

    return {
      gainers: gainers.length > 0 ? gainers : validStocks.slice(0, 3),
      losers: losers.length > 0 ? losers : validStocks.slice(-3),
    };
  } catch (err) {
    console.error('Failed to fetch top movers:', err.message);
    return { gainers: [], losers: [] };
  }
};

// Search Stocks
export const searchStocks = async (query) => {
  try {
    const res = await axios.get(`${BASE_URL}/symbol_search`, {
      params: { symbol: query, apikey: API_KEY },
    });
    const results = res.data.data || [];
    return results.slice(0, 10).map((s) => ({
      symbol: s.symbol,
      name: s.instrument_name || s.symbol,
      price: (Math.random() * 1000).toFixed(2), // Random price for display
      change: (Math.random() * 10 - 5).toFixed(2),
      changePercent: (Math.random() * 5 - 2.5).toFixed(2),
    }));
  } catch (err) {
    console.error('Search failed:', err.message);
    return [];
  }
};

// 🔥 Chart Data with Dynamic Interval
export const getStockChartData = async (symbol, interval = '5min', outputsize = 12) => {
  try {
    const res = await axios.get(`${BASE_URL}/time_series`, {
      params: { symbol, interval, outputsize, apikey: API_KEY },
    });
    const values = res.data?.values || [];
    return values.reverse().map((v) => ({
      datetime: v.datetime,
      close: parseFloat(v.close),
    }));
  } catch (err) {
    console.error(`Chart fetch error (${symbol}, ${interval}):`, err.message);
    return [];
  }
};

// Get Company Profile (using quote as fallback)
export const getCompanyProfile = async (symbol) => {
  try {
    const res = await axios.get(`${BASE_URL}/quote`, {
      params: { symbol, apikey: API_KEY },
    });
    const d = res.data;
    if (!d || d.status === 'error' || !d.symbol) {
      console.warn(`Company quote not found for ${symbol}:`, d.message || 'Unknown error');
      return null;
    }

    return {
      name: d.name || symbol,
      exchange: d.exchange || 'N/A',
      industry: d.type || 'N/A',
      website: `https://www.google.com/search?q=${symbol}+stock`,
    };
  } catch (err) {
    console.error(`Error fetching company quote for ${symbol}:`, err.message);
    return null;
  }
};









// OPTIONAL: You can implement searchSymbols function here if you want autocomplete,
// but Alpha Vantage doesn't have a direct symbol search API endpoint.
// You may need to use a different API or mock search results.









