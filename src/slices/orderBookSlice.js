import { fetchOrderbook } from "../external/api";
import { initialState } from "../redux/initialState";
import { createSlice } from '@reduxjs/toolkit';

const orderbookSlice = createSlice({
  name: 'orderbook',
  initialState: initialState.orderbook,
  reducers: {
    clearOrderbook: (state) => {
      state.bids = [];
      state.asks = [];
      state.lastUpdateId = null;
      state.timestamp = null;
    },
    setSymbol: (state, action) => {
      state.symbol = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderbook.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchOrderbook.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bids = action.payload.bids;
        state.asks = action.payload.asks;
        state.lastUpdateId = action.payload.lastUpdateId;
        state.timestamp = Date.now();
        state.error = null;
      })
      .addCase(fetchOrderbook.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.error;
      });
  },
});

export const { clearOrderbook, setSymbol } = orderbookSlice.actions;
export default orderbookSlice.reducer;
