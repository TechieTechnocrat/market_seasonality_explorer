import { initialState } from "../redux/initialState";
import { createSlice } from '@reduxjs/toolkit';

const calendarSlice = createSlice({
  name: 'calendar',
 initialState: initialState.calendar,
  reducers: {
    setCurrentDate: (state, action) => {
      state.currentDate = action.payload;
    },
    setSelectedDate: (state, action) => {
      state.selectedDate = action.payload;
    },
    setSelectedDateRange: (state, action) => {
      state.selectedDateRange = action.payload;
    },
    setViewMode: (state, action) => {
      state.viewMode = action.payload;
    },
    setCalendarData: (state, action) => {
      state.calendarData = { ...state.calendarData, ...action.payload };
    },
    setHoveredDate: (state, action) => {
      state.hoveredDate = action.payload;
    },
    setTooltip: (state, action) => {
      state.showTooltip = action.payload.show;
      state.tooltipData = action.payload.data;
    },
    navigateMonth: (state, action) => {
      const direction = action.payload; // 'prev' or 'next'
      const newDate = new Date(state.currentDate);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      state.currentDate = newDate;
    },
    clearSelection: (state) => {
      state.selectedDate = null;
      state.selectedDateRange = { start: null, end: null };
    },
  },
});

export const {
  setCurrentDate,
  setSelectedDate,
  setSelectedDateRange,
  setViewMode,
  setCalendarData,
  setHoveredDate,
  setTooltip,
  navigateMonth,
  clearSelection,
} = calendarSlice.actions;

export default calendarSlice.reducer;