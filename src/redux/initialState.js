export const initialState = {
  calendar: {
    viewMode: 'month',             // Options: 'day', 'week', 'month'
    selectedDate: null,            // Single date selected
    selectedRange: [],             // Range of dates selected
  },

  instrument: {
    selectedInstrument: 'BTCUSDT', // Default trading pair
    filters: {
      volatility: true,
      liquidity: true,
      performance: true,
    },
  },

  orderbook: {
    loading: false,
    error: null,
    orderbookData: null,           // API response from Binance
  },
};

