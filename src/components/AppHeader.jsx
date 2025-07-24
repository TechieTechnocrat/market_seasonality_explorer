import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Filter, Download, Settings } from "lucide-react";
import { setViewMode } from "../slices/calendarSlice";
import { useInstrumentHook } from "../hooks/useInstrumentHook"; // adjust path if needed

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

  useEffect(() => {
    loadExchangeInfo();
  }, [loadExchangeInfo]);

  const handleSymbolChange = (e) => {
    changeSymbol(e.target.value);
  };

  const handleViewModeChange = (mode) => {
    dispatch(setViewMode(mode));
  };

  return (
    <header className="app-header">
      <div className="header-left">
        <h1>Market Seasonality Explorer</h1>

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
          <div className="current-price">
            <strong>{`${currentPrice.symbol}: $${currentPrice.price}`}</strong>
          </div>
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
          <button className="icon-button">
            <Filter size={18} />
          </button>
          <button className="icon-button">
            <Download size={18} />
          </button>
          <button className="icon-button">
            <Settings size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};
