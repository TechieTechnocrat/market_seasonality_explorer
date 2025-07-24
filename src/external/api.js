import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';

// Fetch orderbook data
export const fetchOrderbook = createAsyncThunk(
  'orderbook/fetch',
  async (symbol = 'BTCUSDT', { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `https://api.binance.com/api/v3/depth?symbol=${symbol}&limit=5`
      );
      return res.data;
    } catch (err) {
      return rejectWithValue({
        error: err?.response?.data?.msg || 'Error fetching orderbook.',
      });
    }
  }
);

// Fetch 24hr ticker statistics
export const fetch24hrStats = createAsyncThunk(
  'stats/fetch24hr',
  async (symbol = 'BTCUSDT', { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`
      );
      return res.data;
    } catch (err) {
      return rejectWithValue({
        error: err?.response?.data?.msg || 'Error fetching 24hr stats.',
      });
    }
  }
);

// Fetch kline/candlestick data for historical volatility
export const fetchKlineData = createAsyncThunk(
  'kline/fetch',
  async ({ symbol = 'BTCUSDT', interval = '1d', limit = 30 }, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`
      );
      return {
        symbol,
        interval,
        data: res.data.map(candle => ({
          openTime: candle[0],
          open: parseFloat(candle[1]),
          high: parseFloat(candle[2]),
          low: parseFloat(candle[3]),
          close: parseFloat(candle[4]),
          volume: parseFloat(candle[5]),
          closeTime: candle[6],
          quoteVolume: parseFloat(candle[7]),
          trades: candle[8],
          buyVolume: parseFloat(candle[9]),
          buyQuoteVolume: parseFloat(candle[10])
        }))
      };
    } catch (err) {
      return rejectWithValue({
        error: err?.response?.data?.msg || 'Error fetching kline data.',
      });
    }
  }
);

// Fetch current price
export const fetchCurrentPrice = createAsyncThunk(
  'price/fetchCurrent',
  async (symbol = 'BTCUSDT', { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`
      );
      return res.data;
    } catch (err) {
      return rejectWithValue({
        error: err?.response?.data?.msg || 'Error fetching current price.',
      });
    }
  }
);

// Fetch multiple symbols data at once
export const fetchMultipleSymbols = createAsyncThunk(
  'symbols/fetchMultiple',
  async (symbols = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT'], { rejectWithValue }) => {
    try {
      const promises = symbols.map(symbol =>
        axios.get(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`)
      );
      const responses = await Promise.all(promises);
      return responses.map(res => res.data);
    } catch (err) {
      return rejectWithValue({
        error: err?.response?.data?.msg || 'Error fetching multiple symbols.',
      });
    }
  }
);

// Fetch exchange info for available symbols
export const fetchExchangeInfo = createAsyncThunk(
  'exchange/fetchInfo',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get('https://api.binance.com/api/v3/exchangeInfo');
      return {
        symbols: res.data.symbols.filter(s => s.status === 'TRADING').slice(0, 50), // Limit to 50 active symbols
        serverTime: res.data.serverTime
      };
    } catch (err) {
      return rejectWithValue({
        error: err?.response?.data?.msg || 'Error fetching exchange info.',
      });
    }
  }
);