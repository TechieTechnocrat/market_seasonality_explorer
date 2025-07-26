import React, { useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentDate,
  navigateMonth,
  setSelectedDate,
  setShowModal,
  setHoveredDate,
  setTooltipPosition,
} from "../../slices/calendarSlice";
import { setSelectedSymbol } from "../../slices/instrumentSlice";
import { fetchCalendarData } from "../../external/api";
import { ModalSide } from "./ModalSIde";

const MarketSeasonalityExplorer = () => {
  const dispatch = useDispatch();
  const {
    calendarData,
    currentDate,
    isLoading,
    error,
    selectedDate,
    showModal,
    hoveredDate,
    tooltipPosition,
  } = useSelector((state) => state.calendar);

  const { selectedSymbol } = useSelector((state) => state.instrument);

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
    dispatch(setShowModal(false));
  };

  const handleSymbolChange = (symbol) => {
    dispatch(setSelectedSymbol(symbol));
  };

  const handleDateClick = (date) => {
    console.log("hell", date);

    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, "0"); // month is 0-indexed
    const day = `${date.getDate()}`.padStart(2, "0");

    const formattedDate = `${year}-${month}-${day}`;

    console.log("aye", formattedDate);
    dispatch(setSelectedDate(formattedDate)); // store local date
    dispatch(setShowModal(true));
  };

  const handleDateHover = (dateKey, event) => {
    dispatch(setHoveredDate(dateKey));
    dispatch(setTooltipPosition({ x: event.clientX, y: event.clientY }));
  };

  const handleDateLeave = () => {
    dispatch(setHoveredDate(null));
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

      // Create date key in YYYY-MM-DD format using local date components to avoid timezone issues
      const year = cellDate.getFullYear();
      const month = String(cellDate.getMonth() + 1).padStart(2, "0");
      const day = String(cellDate.getDate()).padStart(2, "0");
      const dateKey = `${year}-${month}-${day}`;

      const dayData = calendarData[dateKey];
      const isCurrentMonth = cellDate.getMonth() === currentDateObj.getMonth();
      const isToday = cellDate.toDateString() === today.toDateString();

      // Fix selected date comparison
      const isSelected =
        selectedDate &&
        new Date(selectedDate).toDateString() === cellDate.toDateString();

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
          onMouseLeave={handleDateLeave}
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
      {isLoading ? (
        <div className="loading-overlay">
          <div className="loading-spinner">Loading market data...</div>
        </div>
      ) : (
        <>
          <div className="main-content">
            <div className="calendar-container">
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
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (day) => (
                      <div key={day} className="weekday">
                        {day}
                      </div>
                    )
                  )}
                </div>
                <div className="calendar-days">{renderCalendarCells()}</div>
              </div>
            </div>
          </div>

          {hoveredData && hoveredDate && (
            <div
              className="tooltip-calendar"
              style={{
                left: tooltipPosition.x + 10,
                top: tooltipPosition.y - 10,
                position: "fixed",
                zIndex: 1000,
              }}
            >
              <div className="tooltip-date">
                {new Date(hoveredDate + "T00:00:00").toLocaleDateString()}
              </div>
              <div className="tooltip-row">
                <span>Volatility:</span>
                <span className={getVolatilityColor(hoveredData.volatility)}>
                  {hoveredData.volatility.toFixed(1)}%
                </span>
              </div>
              <div className="tooltip-row">
                <span>Change:</span>
                <span
                  className={getPerformanceIndicator(hoveredData.priceChange)}
                >
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

          <ModalSide />
        </>
      )}
    </>
  );
};

export default MarketSeasonalityExplorer;
