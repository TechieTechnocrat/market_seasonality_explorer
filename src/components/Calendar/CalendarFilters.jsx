import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFilters } from "../../slices/instrumentSlice";

export const CalendarFilters = () => {
  const dispatch = useDispatch();
  const { filters } = useSelector((s) => s.instrument);

  const handleChange = (key, value) => {
    dispatch(setFilters({ ...filters, [key]: value }));
  };

  return (
    <div className="calendar-filters">
      <label>
        Volatility %
        <div className="filter-range-row">
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            value={filters.volatilityRange[1]}
            onChange={e =>
              handleChange("volatilityRange", [0, Number(e.target.value)])
            }
          />
          <span className="filter-value">
            up to <strong>{filters.volatilityRange[1]}%</strong>
          </span>
        </div>
      </label>
      <label>
        Volume
        <div className="filter-range-row">
          <input
            type="range"
            min="0"
            max="1000000"
            step="10000"
            value={filters.volumeRange[1]}
            onChange={e =>
              handleChange("volumeRange", [0, Number(e.target.value)])
            }
          />
          <span className="filter-value">
            up to <strong>{(filters.volumeRange[1] / 1000000).toFixed(2)}M</strong>
          </span>
        </div>
      </label>
      <label>
        Price Change
        <div className="filter-range-row">
          <input
            type="range"
            min="-20"
            max="20"
            step="0.1"
            value={filters.priceChangeRange[1]}
            onChange={e =>
              handleChange("priceChangeRange", [filters.priceChangeRange[0], Number(e.target.value)])
            }
          />
          <span className="filter-value">
            up to <strong>{filters.priceChangeRange[1]}%</strong>
          </span>
        </div>
      </label>
    </div>
  );
};
