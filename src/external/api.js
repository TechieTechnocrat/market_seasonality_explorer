import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';

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