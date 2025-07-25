import { fetchCalendarData } from "../external/api";
import { initialState } from "../redux/initialState";
import { createSlice } from '@reduxjs/toolkit';

const calendarSlice = createSlice({
  name: 'calendar',
  initialState: initialState.calendar,
  reducers: {
    setSelectedDate: (state, action) => {
      state.selectedDate = action.payload;
      console.log("Selected date:", state.selectedDate);
    },
    setSelectedDateRange: (state, action) => {
      state.selectedDateRange = action.payload;
    },
    setViewMode: (state, action) => {
      state.viewMode = action.payload;
    },
    setShowModal: (state, action) => {
      state.showModal = action.payload;
    },
    setCalendarData: (state, action) => {
      state.calendarData = { ...state.calendarData, ...action.payload };
    },
    setHoveredDate: (state, action) => {
      state.hoveredDate = action.payload;
    },
    setTooltipPosition: (state, action) => {
      state.tooltipPosition = action.payload;
    },
    setTooltip: (state, action) => {
      state.showTooltip = action.payload.show;
      state.tooltipData = action.payload.data;
    },
    setCurrentDate: (state, action) => {
      // Convert Date object to string before storing
      state.currentDate = new Date(action.payload).toISOString();
    },
    navigateMonth: (state, action) => {
      const direction = action.payload; // 'prev' or 'next'
      const newDate = new Date(state.currentDate); // Convert string back to Date
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      state.currentDate = newDate.toISOString(); // Store back as string
    },
    clearSelection: (state) => {
      state.selectedDate = null;
      state.selectedDateRange = { start: null, end: null };
      state.showModal = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCalendarData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCalendarData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.calendarData = action.payload;
      })
      .addCase(fetchCalendarData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export const {
  setCurrentDate,
  setSelectedDate,
  setSelectedDateRange,
  setViewMode,
  setShowModal,
  setCalendarData,
  setHoveredDate,
  setTooltipPosition,
  setTooltip,
  navigateMonth,
  clearSelection,
} = calendarSlice.actions;

export default calendarSlice.reducer;