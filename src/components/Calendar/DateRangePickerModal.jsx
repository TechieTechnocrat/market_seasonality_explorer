import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setSelectedDateRange,
  setShowDateRangeModal,
  setViewMode,
} from "../../slices/calendarSlice";

export const DateRangePickerModal = () => {
  const dispatch = useDispatch();
  const { currentDate, selectedDateRange, showDateRangeModal, viewMode } =
    useSelector((state) => state.calendar);

  // Always compute these — hooks must be above any conditional returns
  const currentMonth = new Date(currentDate).toISOString().slice(0, 7); // YYYY-MM
  const minDate = `${currentMonth}-01`;
  const maxDate = new Date(
    new Date(currentDate).getFullYear(),
    new Date(currentDate).getMonth() + 1,
    0
  )
    .toISOString()
    .slice(0, 10);

  // Local state for input fields
  const [start, setStart] = useState(selectedDateRange.start || minDate);
  const [end, setEnd] = useState(selectedDateRange.end || maxDate);
  const [error, setError] = useState("");

  // Reset local input states and error when modal opens or selectedDateRange changes
  useEffect(() => {
    if (showDateRangeModal && viewMode === "range") {
      setStart(selectedDateRange.start || minDate);
      setEnd(selectedDateRange.end || maxDate);
      setError("");
    }
  }, [showDateRangeModal, selectedDateRange, minDate, maxDate, viewMode]);

  // Render nothing if modal closed or not in range mode
  if (viewMode !== "range" || !showDateRangeModal) return null;

  const onConfirm = () => {
    if (!start || !end) {
      setError("Please select both start and end dates.");
      return;
    }
    if (start > end) {
      setError("Start date must be before or equal to end date.");
      return;
    }
    dispatch(setSelectedDateRange({ start, end }));
    dispatch(setShowDateRangeModal(false));
  };

  const onCancel = () => {
    dispatch(setShowDateRangeModal(false));
    dispatch(setViewMode("monthly")); // fallback to monthly or whichever fits your app
  };

  return (
    <div className="range-picker-overlay" onClick={onCancel} role="dialog" aria-modal="true" aria-labelledby="rangePickerTitle">
      <div className="range-picker-modal" onClick={(e) => e.stopPropagation()}>
        <h3 id="rangePickerTitle">Select Date Range</h3>
        {error && <p className="error-message" role="alert">{error}</p>}

        <div className="input-group">
          <label htmlFor="start-date">Start Date</label>
          <input
            type="date"
            id="start-date"
            value={start}
            min={minDate}
            max={maxDate}
            onChange={(e) => setStart(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label htmlFor="end-date">End Date</label>
          <input
            type="date"
            id="end-date"
            value={end}
            min={minDate}
            max={maxDate}
            onChange={(e) => setEnd(e.target.value)}
          />
        </div>

        <div className="actions">
          <button type="button" onClick={onConfirm}>Confirm</button>
          <button type="button" onClick={onCancel} className="cancel-btn">Cancel</button>
        </div>
      </div>
    </div>
  );
};
