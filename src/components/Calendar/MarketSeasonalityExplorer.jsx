import React, { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  navigateMonth,
  setSelectedDate,
  setShowModal,
  setHoveredDate,
  setTooltipPosition,
  setSelectedDateRange,
  setCurrentDate,
  clearSelection,
} from "../../slices/calendarSlice";
import { fetchCalendarData } from "../../external/api";
import { ModalSide } from "./ModalSIde";
import { CalendarCell } from "./CalendarCell";

export const MarketSeasonalityExplorer = () => {
  const dispatch = useDispatch();

  const {
    calendarData,
    currentDate,
    isLoading,
    error,
    selectedDate,
    selectedDateRange,
    showModal,
    hoveredDate,
    tooltipPosition,
    zoomLevel,
    viewMode,
  } = useSelector((state) => state.calendar);

  const { selectedSymbol, filters } = useSelector((state) => state.instrument);

  const currentDateObj = new Date(currentDate);

  // State for transition
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Fetch data when month or symbol changes
  useEffect(() => {
    const start = new Date(currentDateObj.getFullYear(), currentDateObj.getMonth(), 1);
    const end = new Date(currentDateObj.getFullYear(), currentDateObj.getMonth() + 1, 0);
    const startTime = start.getTime();
    const endTime = end.getTime();
    dispatch(fetchCalendarData({ symbol: selectedSymbol, startTime, endTime }));
  }, [currentDate, selectedSymbol, dispatch]);

  // Handle transition on viewMode change - simple fade out/in
  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => setIsTransitioning(false), 300);
    return () => clearTimeout(timer);
  }, [viewMode]);

  // Helper to get start of week (Sunday)
  const getStartOfWeek = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    d.setDate(d.getDate() - day);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  // --- Helper Functions ---
  const getVolatilityColor = (volatility) => {
    if (volatility < 2) return "low";
    if (volatility < 5) return "medium";
    return "high";
  };
  const getPerformanceIndicator = (p) => {
    if (p > 1) return "positive";
    if (p < -1) return "negative";
    return "neutral";
  };

  // --- Navigation ---
  const handleNavigateMonth = (direction) => {
    dispatch(navigateMonth(direction === 1 ? "next" : "prev"));
    dispatch(setShowModal(false));
  };

  // --- Date Click (single or range select) ---
  const handleDateClick = (date) => {
    if (viewMode === "range") {
      if (!selectedDateRange.start || (selectedDateRange.start && selectedDateRange.end)) {
        dispatch(
          setSelectedDateRange({
            start: date.toISOString().slice(0, 10),
            end: null,
          })
        );
      } else {
        let start = new Date(selectedDateRange.start);
        let end = new Date(date);
        if (end < start) [start, end] = [end, start];
        dispatch(
          setSelectedDateRange({
            start: start.toISOString().slice(0, 10),
            end: end.toISOString().slice(0, 10),
          })
        );
      }
    } else {
      dispatch(setSelectedDate(date.toISOString().slice(0, 10)));
      dispatch(setShowModal(true));
    }
  };

  // --- Hover handlers ---
  const handleDateHover = (dateKey, event) => {
    dispatch(setHoveredDate(dateKey));
    dispatch(setTooltipPosition({ x: event.clientX, y: event.clientY }));
  };
  const handleDateLeave = () => dispatch(setHoveredDate(null));

  // --- Keyboard navigation ---
  useEffect(() => {
    const onKeyDown = (e) => {
      if (showModal) return; // Optional: ignore keys while modal open

      let dateObj = selectedDate
        ? new Date(selectedDate)
        : new Date(currentDate);

      switch (e.key) {
        case "ArrowLeft":
          dateObj.setDate(dateObj.getDate() - 1);
          break;
        case "ArrowRight":
          dateObj.setDate(dateObj.getDate() + 1);
          break;
        case "ArrowUp":
          dateObj.setDate(dateObj.getDate() - 7);
          break;
        case "ArrowDown":
          dateObj.setDate(dateObj.getDate() + 7);
          break;
        case "Enter":
          dispatch(setSelectedDate(dateObj.toISOString().slice(0, 10)));
          dispatch(setShowModal(true));
          break;
        case "Escape":
          dispatch(setShowModal(false));
          dispatch(clearSelection());
          break;
        default:
          return;
      }
      dispatch(setSelectedDate(dateObj.toISOString().slice(0, 10)));
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [dispatch, selectedDate, currentDate, showModal]);

  // --- Render calendar cells according to viewMode ---
  const renderCell = (cellDate, key, today) => {
    const year = cellDate.getFullYear();
    const month = String(cellDate.getMonth() + 1).padStart(2, "0");
    const day = String(cellDate.getDate()).padStart(2, "0");
    const dateKey = `${year}-${month}-${day}`;
    const dayData = calendarData[dateKey];
    const isCurrentMonth = cellDate.getMonth() === currentDateObj.getMonth();
    const isToday = cellDate.toDateString() === today.toDateString();
    const isSelected =
      selectedDate &&
      new Date(selectedDate).toDateString() === cellDate.toDateString();

    let inRange = false;
    if (selectedDateRange.start && selectedDateRange.end) {
      const d = cellDate;
      const start = new Date(selectedDateRange.start);
      const end = new Date(selectedDateRange.end);
      inRange = d >= start && d <= end;
    }

    // Apply filters
    let showByFilter = true;
    if (dayData && filters) {
      const { volumeRange, volatilityRange, priceChangeRange } = filters;
      showByFilter =
        (dayData.volume === undefined ||
          (dayData.volume >= volumeRange[0] && dayData.volume <= volumeRange[1])) &&
        (dayData.volatility === undefined ||
          (dayData.volatility >= volatilityRange[0] &&
            dayData.volatility <= volatilityRange[1])) &&
        (dayData.priceChange === undefined ||
          (dayData.priceChange >= priceChangeRange[0] &&
            dayData.priceChange <= priceChangeRange[1]));
    }

    return (
      <CalendarCell
        key={key}
        date={cellDate}
        dayData={dayData}
        isCurrentMonth={isCurrentMonth}
        isToday={isToday}
        isSelected={isSelected}
        inRange={inRange}
        zoomLevel={zoomLevel}
        showByFilter={showByFilter}
        getVolatilityColor={getVolatilityColor}
        getPerformanceIndicator={getPerformanceIndicator}
        onClick={() =>
          isCurrentMonth && showByFilter && handleDateClick(cellDate)
        }
        onMouseEnter={(e) =>
          isCurrentMonth && dayData && showByFilter && handleDateHover(dateKey, e)
        }
        onMouseLeave={handleDateLeave}
      />
    );
  };

  const renderCalendarCells = () => {
    const today = new Date();

    if (viewMode === "daily") {
      // For daily show only one cell: selectedDate or currentDate
      const singleDay = selectedDate ? new Date(selectedDate) : new Date(currentDate);
      return renderCell(singleDay, 0, today);
    }
    if (viewMode === "weekly") {
      // Show one week starting Sunday of currentDate's week
      const startDate = getStartOfWeek(new Date(currentDate));
      const cells = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        cells.push(renderCell(date, i, today));
      }
      return cells;
    }
    // default monthly
    const startOfMonth = new Date(currentDateObj.getFullYear(), currentDateObj.getMonth(), 1);
    const startDate = new Date(startOfMonth);
    startDate.setDate(startDate.getDate() - startOfMonth.getDay()); // go back to Sunday
    const cells = [];
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      cells.push(renderCell(date, i, today));
    }
    return cells;
  };

  const hoveredData = hoveredDate ? calendarData[hoveredDate] : null;

  if (error) {
    return (
      <div className="error-container" role="alert">
        <h2>Error loading data</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <>
      {isLoading ? (
        <div className="loading-overlay" role="status" aria-live="polite">
          <div className="loading-spinner">Loading market data...</div>
        </div>
      ) : (
        <>
          <div className="main-content">
            <div className="calendar-container" id="calendar-container" role="grid" aria-label="Market Seasonality Calendar">
              <div className="calendar-header">
                <div className="nav-cal">
                  <button
                    className="nav-button"
                    onClick={() => handleNavigateMonth(-1)}
                    disabled={isLoading}
                    aria-label="Previous month"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <div className="current-date" aria-live="polite" aria-atomic="true">
                    {currentDateObj.toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </div>
                  <button
                    className="nav-button"
                    onClick={() => handleNavigateMonth(1)}
                    disabled={isLoading}
                    aria-label="Next month"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
                <div className="legend" aria-hidden="true">
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

              <div
                className={`calendar-grid ${isTransitioning ? "fade-out" : "fade-in"}`}
              >
                <div className="weekdays" role="row">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div key={day} className="weekday" role="columnheader">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="calendar-days" role="rowgroup">
                  {renderCalendarCells()}
                </div>
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
              role="tooltip"
              aria-live="polite"
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

          <ModalSide />
        </>
      )}
    </>
  );
};

