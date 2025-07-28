import { createSlice } from "@reduxjs/toolkit";
import {
  fetch24hrStats,
  fetchKlineData,
  fetchCurrentPrice,
  fetchMultipleSymbols,
  fetchExchangeInfo,
} from "../external/api";
import { initialState } from "../redux/initialState";

const instrumentSlice = createSlice({
  name: "instrument",
  initialState: initialState.instrument,
  reducers: {
    setSelectedSymbol: (state, action) => {
      state.selectedSymbol = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
    },
    setAvailableSymbols: (state, action) => {
      state.availableSymbols = action.payload;
    },
    setCurrentPrice: (state, action) => {
      state.currentPrice = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // 24hr stats
      .addCase(fetch24hrStats.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetch24hrStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats24hr = action.payload;
      })
      .addCase(fetch24hrStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.error;
      })
      // Kline data
      .addCase(fetchKlineData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchKlineData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.klineData = action.payload.data;
      })
      .addCase(fetchKlineData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.error;
      })
      // Current price
      .addCase(fetchCurrentPrice.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCurrentPrice.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentPrice = action.payload;
      })
      .addCase(fetchCurrentPrice.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.error;
      })
      // Multiple symbols
      .addCase(fetchMultipleSymbols.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchMultipleSymbols.fulfilled, (state, action) => {
        state.isLoading = false;
        state.multipleSymbolsData = action.payload;
      })
      .addCase(fetchMultipleSymbols.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.error;
      })
      // Exchange info
      .addCase(fetchExchangeInfo.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchExchangeInfo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.availableSymbols = action.payload.symbols;
      })
      .addCase(fetchExchangeInfo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.error;
      });
  },
});

export const {
  setSelectedSymbol,
  setFilters,
  clearError,
  setAvailableSymbols,
  setCurrentPrice,
  setLoading,
  setError,
} = instrumentSlice.actions;
export default instrumentSlice.reducer;
