export const helperFunctions = {
  JPJS: (v) => {
    return JSON.parse(JSON.stringify(v));
  },
};

export const JPJS = (value) => {
  return JSON.parse(JSON.stringify(value));
};

// utils/dataHelpers.js
export const calculateVolatility = (prices, period = 20) => {
  if (prices.length < period) return 0;
  
  const returns = [];
  for (let i = 1; i < prices.length; i++) {
    returns.push(Math.log(prices[i] / prices[i - 1]));
  }
  
  const mean = returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
  const variance = returns.reduce((sum, ret) => sum + Math.pow(ret - mean, 2), 0) / returns.length;
  
  return Math.sqrt(variance) * Math.sqrt(252) * 100; // Annualized volatility
};

export const calculateLiquidity = (orderbook) => {
  if (!orderbook.bids || !orderbook.asks) return 0;
  
  const bidVolume = orderbook.bids.reduce((sum, [price, volume]) => sum + parseFloat(volume), 0);
  const askVolume = orderbook.asks.reduce((sum, [price, volume]) => sum + parseFloat(volume), 0);
  
  return bidVolume + askVolume;
};

export const calculatePerformance = (openPrice, closePrice) => {
  if (!openPrice || !closePrice) return 0;
  return ((closePrice - openPrice) / openPrice) * 100;
};

export const getVolatilityColor = (volatility) => {
  if (volatility < 10) return 'bg-green-200 text-green-800';
  if (volatility < 25) return 'bg-yellow-200 text-yellow-800';
  if (volatility < 50) return 'bg-orange-200 text-orange-800';
  return 'bg-red-200 text-red-800';
};

export const getLiquidityIndicator = (liquidity) => {
  if (liquidity < 100) return { pattern: 'low', color: 'red' };
  if (liquidity < 1000) return { pattern: 'medium', color: 'yellow' };
  return { pattern: 'high', color: 'green' };
};

export const getPerformanceIndicator = (performance) => {
  if (performance > 0) return { arrow: 'up', color: 'green' };
  if (performance < 0) return { arrow: 'down', color: 'red' };
  return { arrow: 'neutral', color: 'gray' };
};

export const formatCurrency = (value, decimals = 2) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

export const formatPercentage = (value, decimals = 2) => {
  return `${value >= 0 ? '+' : ''}${value.toFixed(decimals)}%`;
};

export const formatVolume = (volume) => {
  if (volume >= 1e9) return `${(volume / 1e9).toFixed(2)}B`;
  if (volume >= 1e6) return `${(volume / 1e6).toFixed(2)}M`;
  if (volume >= 1e3) return `${(volume / 1e3).toFixed(2)}K`;
  return volume.toFixed(2);
};

export const aggregateDataByPeriod = (data, period = 'daily') => {
  switch (period) {
    case 'weekly':
      return aggregateWeekly(data);
    case 'monthly':
      return aggregateMonthly(data);
    default:
      return data;
  }
};

const aggregateWeekly = (dailyData) => {
  const weeks = {};
  
  dailyData.forEach(day => {
    const date = new Date(day.date);
    const weekStart = getWeekStart(date);
    const weekKey = weekStart.toISOString().split('T')[0];
    
    if (!weeks[weekKey]) {
      weeks[weekKey] = {
        date: weekStart,
        volatility: [],
        volume: 0,
        performance: 0,
        high: -Infinity,
        low: Infinity,
        open: day.open,
        close: day.close,
      };
    }
    
    weeks[weekKey].volatility.push(day.volatility);
    weeks[weekKey].volume += day.volume;
    weeks[weekKey].high = Math.max(weeks[weekKey].high, day.high);
    weeks[weekKey].low = Math.min(weeks[weekKey].low, day.low);
    weeks[weekKey].close = day.close;
  });
  
  return Object.values(weeks).map(week => ({
    ...week,
    volatility: week.volatility.reduce((sum, v) => sum + v, 0) / week.volatility.length,
    performance: calculatePerformance(week.open, week.close),
  }));
};

const aggregateMonthly = (dailyData) => {
  const months = {};
  
  dailyData.forEach(day => {
    const date = new Date(day.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!months[monthKey]) {
      months[monthKey] = {
        date: new Date(date.getFullYear(), date.getMonth(), 1),
        volatility: [],
        volume: 0,
        performance: 0,
        high: -Infinity,
        low: Infinity,
        open: day.open,
        close: day.close,
      };
    }
    
    months[monthKey].volatility.push(day.volatility);
    months[monthKey].volume += day.volume;
    months[monthKey].high = Math.max(months[monthKey].high, day.high);
    months[monthKey].low = Math.min(months[monthKey].low, day.low);
    months[monthKey].close = day.close;
  });
  
  return Object.values(months).map(month => ({
    ...month,
    volatility: month.volatility.reduce((sum, v) => sum + v, 0) / month.volatility.length,
    performance: calculatePerformance(month.open, month.close),
  }));
};

const getWeekStart = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
};

// utils/dateUtils.js
export const formatDate = (date, format = 'YYYY-MM-DD') => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  
  switch (format) {
    case 'YYYY-MM-DD':
      return `${year}-${month}-${day}`;
    case 'MM/DD/YYYY':
      return `${month}/${day}/${year}`;
    case 'DD/MM/YYYY':
      return `${day}/${month}/${year}`;
    case 'MMM DD, YYYY':
      return d.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    default:
      return d.toISOString().split('T')[0];
  }
};

export const getDaysInMonth = (year, month) => {
  return new Date(year, month + 1, 0).getDate();
};

export const getFirstDayOfMonth = (year, month) => {
  return new Date(year, month, 1).getDay();
};

export const isToday = (date) => {
  const today = new Date();
  const checkDate = new Date(date);
  return today.toDateString() === checkDate.toDateString();
};

export const isSameMonth = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth();
};

export const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const addMonths = (date, months) => {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
};

export const getCalendarGrid = (year, month) => {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const grid = [];
  
  // Previous month's trailing days
  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;
  const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth);
  
  for (let i = firstDay - 1; i >= 0; i--) {
    grid.push({
      date: new Date(prevYear, prevMonth, daysInPrevMonth - i),
      isCurrentMonth: false,
      isPrevMonth: true,
    });
  }
  
  // Current month's days
  for (let day = 1; day <= daysInMonth; day++) {
    grid.push({
      date: new Date(year, month, day),
      isCurrentMonth: true,
      isPrevMonth: false,
    });
  }
  
  // Next month's leading days to complete the grid
  const nextMonth = month === 11 ? 0 : month + 1;
  const nextYear = month === 11 ? year + 1 : year;
  const remainingCells = 42 - grid.length; // 6 rows × 7 days
  
  for (let day = 1; day <= remainingCells; day++) {
    grid.push({
      date: new Date(nextYear, nextMonth, day),
      isCurrentMonth: false,
      isPrevMonth: false,
    });
  }
  
  return grid;
};

export const getWeekDays = (short = false) => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return short ? days.map(day => day.slice(0, 3)) : days;
};

export const getMonthNames = (short = false) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return short ? months.map(month => month.slice(0, 3)) : months;
};