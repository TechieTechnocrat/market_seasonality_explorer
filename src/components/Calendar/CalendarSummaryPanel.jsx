import React from "react";
import { useSelector } from "react-redux";
import { format } from "date-fns";

function getRangeDates(viewMode, selectedDate) {
  // Returns [startDate, endDate] (Date objects) for day, week, month
  const baseDate = selectedDate ? new Date(selectedDate) : new Date();
  if (viewMode === "daily") {
    return [baseDate, baseDate];
  }
  if (viewMode === "weekly") {
    const start = new Date(baseDate);
    start.setDate(start.getDate() - start.getDay());
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return [start, end];
  }
  // Monthly
  const start = new Date(baseDate.getFullYear(), baseDate.getMonth(), 1);
  const end = new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, 0);
  return [start, end];
}

function aggregateSummary(calendarData, startDate, endDate) {
  // Returns summary object for the given range
  const results = [];
  let loopDate = new Date(startDate);
  while (loopDate <= endDate) {
    const key = loopDate.toISOString().slice(0, 10);
    if (calendarData[key]) results.push(calendarData[key]);
    loopDate.setDate(loopDate.getDate() + 1);
  }
  if (results.length === 0) return null;

  const totalVolume = results.reduce((sum, d) => sum + (d.volume || 0), 0);
  const avgVolatility = results.reduce((sum, d) => sum + (d.volatility || 0), 0) / results.length;
  const totalTrades = results.reduce((sum, d) => sum + (d.trades || 0), 0);
  const avgPriceChange = results.reduce((sum, d) => sum + (d.priceChange || 0), 0) / results.length;

  // For performance summary, e.g.: net change between first and last close
  const firstDay = results[0], lastDay = results[results.length - 1];
  const netPriceChange = lastDay && firstDay
    ? ((lastDay.close - firstDay.open) / firstDay.open) * 100
    : null;

  return {
    count: results.length,
    totalVolume,
    avgVolatility,
    totalTrades,
    avgPriceChange,
    netPriceChange,
    firstDay,
    lastDay,
  };
}

export const CalendarSummaryPanel = () => {
  const { calendarData, viewMode, selectedDate } = useSelector(state => state.calendar);

  const [startDate, endDate] = getRangeDates(viewMode, selectedDate);
  const stats = aggregateSummary(calendarData, startDate, endDate);

  if (!stats) return null;

  return (
    <div className="calendar-summary-panel">
      <h4>
        {viewMode.charAt(0).toUpperCase() + viewMode.slice(1)} Summary&nbsp;
        <span>
          ({format(startDate, "MMM d, yyyy")}{startDate < endDate ? " – " + format(endDate, "MMM d, yyyy") : ""})
        </span>
      </h4>
      <div className="summary-grid">
        <div>
          <label>Avg Volatility</label>
          <div>{stats.avgVolatility?.toFixed(2)}%</div>
        </div>
        <div>
          <label>Total Volume</label>
          <div>{(stats.totalVolume / 1e6).toFixed(2)}M</div>
        </div>
        <div>
          <label>Total Trades</label>
          <div>{stats.totalTrades?.toLocaleString()}</div>
        </div>
        <div>
          <label>Avg Price Change</label>
          <div>
            {stats.avgPriceChange > 0 ? '+' : ''}
            {stats.avgPriceChange?.toFixed(2)}%
          </div>
        </div>
        <div>
          <label>Net Performance</label>
          <div>
            {stats.netPriceChange !== null
              ? (stats.netPriceChange > 0 ? '+' : '') + stats.netPriceChange.toFixed(2) + '%'
              : '—'}
          </div>
        </div>
        {viewMode === "daily" && stats.firstDay && (
          <div>
            <label>OHLC</label>
            <div>
              {['Open', 'High', 'Low', 'Close'].map(k => (
                <span key={k} style={{marginRight: 4}}>
                  {k}: ${stats.firstDay[k.toLowerCase()].toLocaleString()}
                </span>
              ))}
            </div>
          </div>
        )}
        {/* Add more detailed metrics if needed */}
      </div>
    </div>
  );
};
