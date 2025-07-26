import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { BarChart3 } from "lucide-react";
import { setShowModal } from "../../slices/calendarSlice";

export const ModalSide = () => {
  const dispatch = useDispatch();
  const { showModal, selectedDate, calendarData } = useSelector(
    (state) => state.calendar
  );

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

  const handleCloseModal = () => {
    dispatch(setShowModal(false));
  };

  if (!showModal || !selectedDate) return null;

  const selectedDateObj = new Date(selectedDate);
  const dateKey = selectedDateObj.toISOString().split("T")[0];
  const selectedData = calendarData[dateKey];

  if (!selectedData) return null;

  return (
    <div className="modal-overlay" onClick={handleCloseModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>
            {selectedDateObj.toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </h3>
          <button
            className="close-button"
            onClick={handleCloseModal}
          >
            ×
          </button>
        </div>

        <div className="modal-body">
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
    </div>
  );
};