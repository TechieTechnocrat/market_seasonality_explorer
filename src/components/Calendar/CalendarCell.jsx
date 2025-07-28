import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

export const CalendarCell = ({
  date,
  dayData,
  isCurrentMonth,
  isToday,
  isSelected,
  inRange,
  zoomLevel,
  showByFilter,
  getVolatilityColor,
  getPerformanceIndicator,
  onClick,
  onMouseEnter,
  onMouseLeave,
}) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const dateKey = `${year}-${month}-${day}`;

  let className =
    "calendar-cell" +
    (isCurrentMonth ? "" : " other-month") +
    (isToday ? " today" : "") +
    (isSelected ? " selected" : "") +
    (inRange ? " in-range" : "") +
    (zoomLevel !== undefined ? ` zoom-level-${zoomLevel}` : "");
  console.log(zoomLevel);
  if (!showByFilter) {
    className += " filtered-out";
  }

  // Determine performance state class for backgrounds and icons
  const performanceState = dayData
    ? getPerformanceIndicator(dayData.priceChange)
    : "neutral";
  const volatilityState = dayData
    ? getVolatilityColor(dayData.volatility)
    : "low";

  return (
    <div
      className={className}
      style={showByFilter ? {} : { opacity: 0.2, pointerEvents: "none" }}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      tabIndex={isCurrentMonth ? 0 : -1}
      aria-label={`Date ${dateKey}`}
      role="gridcell"
    >
      {/* Volatility colored background with subtle opacity */}
      <div className={`volatility-bg ${volatilityState}`} aria-hidden="true" />
      <div className={`volume-pattern ${volatilityState}`}></div>

      <div className="cell-header">
        <span className="date-number">{date.getDate()}</span>
        {/* Performance indicator icon and colored background */}
        {dayData && showByFilter && (
          <div
            className={`performance-indicator ${performanceState}`}
            aria-hidden="true"
          >
            {performanceState === "positive" && <TrendingUp size={15} />}
            {performanceState === "negative" && <TrendingDown size={15} />}
          </div>
        )}
      </div>

      {/* Liquidity: volume bar with pattern overlay */}
      {dayData && showByFilter && (
        <div className="cell-content">
          <div
            className="volume-bar"
            style={{
              height: `${Math.min(dayData.volume / 10000000, 20)}px`,
            }}
          >
            {/* Additional pattern overlays */}
          </div>
          {/* Price change text with performance color */}
          <div className={`price-change ${performanceState}`}>
            {dayData.priceChange > 0 ? "+" : ""}
            {dayData.priceChange.toFixed(1)}%
          </div>
        </div>
      )}
    </div>
  );
};
