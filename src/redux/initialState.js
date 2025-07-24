export const initialState = {
  calendar: {
    currentDate: new Date(),
    selectedDate: null,
    selectedDateRange: { start: null, end: null },
    viewMode: 'monthly', 
    isLoading: false,
    error: null,
    calendarData: {},
    hoveredDate: null,
    showTooltip: false,
    tooltipData: null,
  },

  instrument: {
    selectedSymbol: 'BTCUSDT',
    availableSymbols: [],
    currentPrice: null,
    stats24hr: null,
    klineData: [],
    multipleSymbolsData: [],
    filters: {
      volatilityRange: [0, 100],
      volumeRange: [0, 1000000],
      priceChangeRange: [-20, 20],
    },
    isLoading: false,
    error: null,
  },

  orderbook: {
  lastUpdateId: null,
  bids: [],
  asks: [],
  symbol: 'BTCUSDT',
  isLoading: false,
  error: null,
  timestamp: null,
  },
};

