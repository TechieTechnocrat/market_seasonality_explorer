import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Filter,
  Download,
  Settings,
  CalendarRange,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { setViewMode, setZoomLevel, setShowDateRangeModal } from "../slices/calendarSlice";
import { useInstrumentHook } from "../hooks/useInstrumentHook";
import Tooltip from "@mui/material/Tooltip";
import html2canvas from "html2canvas";

export const AppHeader = () => {
  const dispatch = useDispatch();
  const {
    selectedSymbol,
    availableSymbols,
    currentPrice,
    isLoading,
    changeSymbol,
    loadExchangeInfo,
  } = useInstrumentHook();

  const viewMode = useSelector((state) => state.calendar.viewMode);
  const zoomLevel = useSelector((state) => state.calendar.zoomLevel);
  const showDateRangeModal = useSelector((state) => state.calendar.showDateRangeModal);

  useEffect(() => {
    loadExchangeInfo();
  }, [loadExchangeInfo]);

  const handleSymbolChange = (e) => {
    changeSymbol(e.target.value);
  };

  const handleViewModeChange = (mode) => {
    dispatch(setViewMode(mode));
    if (mode !== "range") {
      dispatch(setShowDateRangeModal(false));
    }
  };

  const handleZoomIn = () => {
    dispatch(setZoomLevel(Math.min(2, zoomLevel + 1)));
  };

  const handleZoomOut = () => {
    dispatch(setZoomLevel(Math.max(0, zoomLevel - 1)));
  };

  const handleDownload = () => {
    const calendarElement = document.getElementById("calendar-container");
    if (!calendarElement) {
      alert("Calendar container not found.");
      return;
    }
    html2canvas(calendarElement).then((canvas) => {
      const link = document.createElement("a");
      link.download = "calendar_capture.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    });
  };

  // Toggle range mode and open/close date range modal
  const handleRangeToggle = () => {
    if (viewMode === "range") {
      // Turning off range mode and closing modal
      dispatch(setViewMode("monthly"));
      dispatch(setShowDateRangeModal(false));
    } else {
      dispatch(setViewMode("range"));
      dispatch(setShowDateRangeModal(true));
    }
  };

  return (
    <div className="main-header-app">
      <div className="header-left">
        <div className="symbol-selector">
          <select
            value={selectedSymbol}
            onChange={handleSymbolChange}
            disabled={isLoading}
          >
            {availableSymbols.map((s) => {
              const symbol = typeof s === "string" ? s : s.symbol;
              return (
                <option key={symbol} value={symbol}>
                  {symbol}
                </option>
              );
            })}
          </select>
        </div>

        {currentPrice && (
          <Tooltip title="Current Price" arrow>
            <div className="current-price">
              <strong>{` $${currentPrice.price}`}</strong>
            </div>
          </Tooltip>
        )}
      </div>

      <div className="header-controls">
        <div className="view-mode-selector">
          {["daily", "weekly", "monthly"].map((mode) => (
            <button
              key={mode}
              className={viewMode === mode ? "active" : ""}
              onClick={() => handleViewModeChange(mode)}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>

        <div className="header-actions">
          <button
            className="icon-button"
            title="Download calendar"
            onClick={handleDownload}
          >
            <Download size={18} />
          </button>
          <button
            className={`icon-button ${viewMode === "range" ? "active" : ""}`}
            title="Date Range Selection"
            onClick={handleRangeToggle}
          >
            <CalendarRange size={18} />
          </button>
          <button className="icon-button" title="Zoom In" onClick={handleZoomIn}>
            <ZoomIn size={18} />
          </button>
          <button className="icon-button" title="Zoom Out" onClick={handleZoomOut}>
            <ZoomOut size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
