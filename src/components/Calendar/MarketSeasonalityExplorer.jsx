import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Filter,
  Download,
  Settings,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentDate,
  navigateMonth,
  setSelectedDate,
} from "../../slices/calendarSlice";
import { fetchCalendarData } from "../../external/api";

const MarketSeasonalityExplorer = () => {
  const dispatch = useDispatch();
  const { calendarData, currentDate, isLoading, error } = useSelector(
    (state) => state.calendar
  );

  const [selectedDate, setLocalSelectedDate] = useState(null);
  const [viewMode, setViewMode] = useState("monthly");
  const [selectedSymbol, setSelectedSymbol] = useState("BTCUSDT");
  const [showSidePanel, setShowSidePanel] = useState(false);
  const [hoveredDate, setHoveredDate] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const symbols = ["BTCUSDT", "ETHUSDT", "BNBUSDT", "ADAUSDT", "DOTUSDT"];

  // Convert currentDate string back to Date object for display
  const currentDateObj = new Date(currentDate);

  useEffect(() => {
    const start = new Date(
      currentDateObj.getFullYear(),
      currentDateObj.getMonth(),
      1
    );
    const end = new Date(
      currentDateObj.getFullYear(),
      currentDateObj.getMonth() + 1,
      0
    );
    const startTime = start.getTime();
    const endTime = end.getTime();

    dispatch(fetchCalendarData({ symbol: selectedSymbol, startTime, endTime }));
  }, [currentDate, selectedSymbol, dispatch]);

  // Get volatility color
  const getVolatilityColor = (volatility) => {
    if (volatility < 2) return "low";
    if (volatility < 5) return "medium";
    return "high";
  };

  // Get performance indicator
  const getPerformanceIndicator = (priceChange) => {
    if (priceChange > 1) return "positive";
    if (priceChange < -1) return "negative";
    return "neutral";
  };

  // Navigation functions
  const handleNavigateMonth = (direction) => {
    const navigationDirection = direction === 1 ? "next" : "prev";
    dispatch(navigateMonth(navigationDirection));
    setShowSidePanel(false);
    setLocalSelectedDate(null);
  };

  const handleDateClick = (date) => {
    setLocalSelectedDate(date);
    dispatch(setSelectedDate(date.toISOString()));
    setShowSidePanel(true);
  };

  const handleDateHover = (date, event) => {
    setHoveredDate(date);
    setTooltipPosition({ x: event.clientX, y: event.clientY });
  };

  const renderCalendarCells = () => {
    const startOfMonth = new Date(
      currentDateObj.getFullYear(),
      currentDateObj.getMonth(),
      1
    );
    const startDate = new Date(startOfMonth);
    startDate.setDate(startDate.getDate() - startOfMonth.getDay());

    const cells = [];
    const today = new Date();

    for (let i = 0; i < 42; i++) {
      const cellDate = new Date(startDate);
      cellDate.setDate(startDate.getDate() + i);

      const dateKey = cellDate.toISOString().split("T")[0];
      const dayData = calendarData[dateKey];
      const isCurrentMonth = cellDate.getMonth() === currentDateObj.getMonth();
      const isToday = cellDate.toDateString() === today.toDateString();
      const isSelected =
        selectedDate && cellDate.toDateString() === selectedDate.toDateString();

      cells.push(
        <div
          key={i}
          className={`calendar-cell ${!isCurrentMonth ? "other-month" : ""} ${
            isToday ? "today" : ""
          } ${isSelected ? "selected" : ""}`}
          onClick={() => isCurrentMonth && handleDateClick(cellDate)}
          onMouseEnter={(e) =>
            isCurrentMonth && dayData && handleDateHover(dateKey, e)
          }
          onMouseLeave={() => setHoveredDate(null)}
        >
          <div className="cell-header">
            <span className="date-number">{cellDate.getDate()}</span>
            {dayData && (
              <div className="performance-indicator">
                {getPerformanceIndicator(dayData.priceChange) ===
                  "positive" && <TrendingUp size={15} />}
                {getPerformanceIndicator(dayData.priceChange) ===
                  "negative" && <TrendingDown size={15} />}
              </div>
            )}
          </div>

          {dayData && (
            <>
              <div
                className={`volatility-bg ${getVolatilityColor(
                  dayData.volatility
                )}`}
              ></div>
              <div className="cell-content">
                <div
                  className="volume-bar"
                  style={{
                    height: `${Math.min(dayData.volume / 10000000, 20)}px`,
                  }}
                ></div>
                <div className="price-change">
                  {dayData.priceChange > 0 ? "+" : ""}
                  {dayData.priceChange.toFixed(1)}%
                </div>
              </div>
            </>
          )}
        </div>
      );
    }

    return cells;
  };

  const selectedData = selectedDate
    ? calendarData[selectedDate.toISOString().split("T")[0]]
    : null;
  const hoveredData = hoveredDate ? calendarData[hoveredDate] : null;

  if (error) {
    return (
      <div className="error-container">
        <h2>Error loading data</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <>
      {/* Loading Indicator */}
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner">Loading market data...</div>
        </div>
      )}

      <div className="main-content">
        <div
          className={`calendar-container ${
            showSidePanel ? "with-sidepanel" : ""
          }`}
        >
          <div className="calendar-header">
            <div className="nav-cal">
              <button
                className="nav-button"
                onClick={() => handleNavigateMonth(-1)}
                disabled={isLoading}
              >
                <ChevronLeft size={20} />
              </button>
              <div className="current-date">
                {currentDateObj.toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </div>
              <button
                className="nav-button"
                onClick={() => handleNavigateMonth(1)}
                disabled={isLoading}
              >
                <ChevronRight size={20} />
              </button>
            </div>
            <div className="legend">
              <div className="legend-item">
                <div className="color-box low"></div>
                <span>Low (&lt;2%)</span>
              </div>
              <div className="legend-item">
                <div className="color-box medium"></div>
                <span>Medium (2-5%)</span>
              </div>
              <div className="legend-item">
                <div className="color-box high"></div>
                <span>High (&gt;5%)</span>
              </div>
            </div>
          </div>

          <div className="calendar-grid">
            <div className="weekdays">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="weekday">
                  {day}
                </div>
              ))}
            </div>
            <div className="calendar-days">{renderCalendarCells()}</div>
          </div>
        </div>

        {/* Side Panel */}
        {showSidePanel && selectedData && selectedDate && (
          <div className="side-panel">
            <div className="panel-header">
              <h3>
                {selectedDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </h3>
              <button
                className="close-button"
                onClick={() => setShowSidePanel(false)}
              >
                ×
              </button>
            </div>

            <div className="panel-content">
              <div className="metric-grid">
                <div className="metric-card">
                  <div className="metric-label">Price Change</div>
                  <div
                    className={`metric-value ${getPerformanceIndicator(
                      selectedData.priceChange
                    )}`}
                  >
                    {selectedData.priceChange > 0 ? "+" : ""}
                    {selectedData.priceChange.toFixed(2)}%
                  </div>
                </div>

                <div className="metric-card">
                  <div className="metric-label">Volatility</div>
                  <div
                    className={`metric-value ${getVolatilityColor(
                      selectedData.volatility
                    )}`}
                  >
                    {selectedData.volatility.toFixed(2)}%
                  </div>
                </div>

                <div className="metric-card">
                  <div className="metric-label">Volume</div>
                  <div className="metric-value">
                    {(selectedData.volume / 1000000).toFixed(1)}M
                  </div>
                </div>

                <div className="metric-card">
                  <div className="metric-label">Trades</div>
                  <div className="metric-value">
                    {selectedData.trades.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="price-details">
                <h4>Price Details</h4>
                <div className="price-row">
                  <span>Open:</span>
                  <span>${selectedData.open.toLocaleString()}</span>
                </div>
                <div className="price-row">
                  <span>High:</span>
                  <span>${selectedData.high.toLocaleString()}</span>
                </div>
                <div className="price-row">
                  <span>Low:</span>
                  <span>${selectedData.low.toLocaleString()}</span>
                </div>
                <div className="price-row">
                  <span>Close:</span>
                  <span>${selectedData.close.toLocaleString()}</span>
                </div>
              </div>

              <div className="mini-chart">
                <BarChart3 size={100} className="chart-placeholder" />
                <p>Chart visualization would go here</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {hoveredData && hoveredDate && (
        <div
          className="tooltip"
          style={{
            left: tooltipPosition.x + 10,
            top: tooltipPosition.y - 10,
            position: "fixed",
            zIndex: 1000,
          }}
        >
          <div className="tooltip-date">
            {new Date(hoveredDate).toLocaleDateString()}
          </div>
          <div className="tooltip-row">
            <span>Volatility:</span>
            <span className={getVolatilityColor(hoveredData.volatility)}>
              {hoveredData.volatility.toFixed(1)}%
            </span>
          </div>
          <div className="tooltip-row">
            <span>Change:</span>
            <span className={getPerformanceIndicator(hoveredData.priceChange)}>
              {hoveredData.priceChange > 0 ? "+" : ""}
              {hoveredData.priceChange.toFixed(1)}%
            </span>
          </div>
          <div className="tooltip-row">
            <span>Volume:</span>
            <span>{(hoveredData.volume / 1000000).toFixed(1)}M</span>
          </div>
        </div>
      )}
    </>
  );
};

export default MarketSeasonalityExplorer;
