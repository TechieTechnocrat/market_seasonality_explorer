import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  setCurrentDate, 
  setSelectedDate, 
  setSelectedDateRange, 
  setViewMode, 
  navigateMonth,
  setCalendarData,
  setHoveredDate,
  setTooltip 
} from '../slices';
import { getCalendarGrid } from '../helpers/helperFunctions';

export const useCalendarHook = () => {
  const dispatch = useDispatch();
  const calendar = useSelector(state => state.calendar);
  const [isSelecting, setIsSelecting] = useState(false);

  const handleDateClick = useCallback((date) => {
    if (isSelecting && calendar.selectedDateRange.start && !calendar.selectedDateRange.end) {
      const start = calendar.selectedDateRange.start;
      const end = date;
      dispatch(setSelectedDateRange({ 
        start: start < end ? start : end, 
        end: start < end ? end : start 
      }));
      setIsSelecting(false);
    } else {
      // Start new selection
      dispatch(setSelectedDate(date));
      dispatch(setSelectedDateRange({ start: date, end: null }));
      setIsSelecting(true);
    }
  }, [dispatch, isSelecting, calendar.selectedDateRange]);

  const handleDateHover = useCallback((date, data) => {
    dispatch(setHoveredDate(date));
    if (data) {
      dispatch(setTooltip({ show: true, data }));
    }
  }, [dispatch]);

  const handleDateLeave = useCallback(() => {
    dispatch(setHoveredDate(null));
    dispatch(setTooltip({ show: false, data: null }));
  }, [dispatch]);

  const navigatePrevious = useCallback(() => {
    dispatch(navigateMonth('prev'));
  }, [dispatch]);

  const navigateNext = useCallback(() => {
    dispatch(navigateMonth('next'));
  }, [dispatch]);

  const changeViewMode = useCallback((mode) => {
    dispatch(setViewMode(mode));
  }, [dispatch]);

  const goToToday = useCallback(() => {
    dispatch(setCurrentDate(new Date()));
  }, [dispatch]);

  const clearSelection = useCallback(() => {
    dispatch(setSelectedDate(null));
    dispatch(setSelectedDateRange({ start: null, end: null }));
    setIsSelecting(false);
  }, [dispatch]);

  // Generate calendar grid
  const calendarGrid = getCalendarGrid(
    calendar.currentDate.getFullYear(),
    calendar.currentDate.getMonth()
  );

  // Handle keyboard navigation
  const handleKeyDown = useCallback((event) => {
    switch (event.key) {
      case 'ArrowLeft':
        navigatePrevious();
        break;
      case 'ArrowRight':
        navigateNext();
        break;
      case 'Escape':
        clearSelection();
        break;
      case 'Enter':
        if (calendar.hoveredDate) {
          handleDateClick(calendar.hoveredDate);
        }
        break;
      default:
        break;
    }
  }, [navigatePrevious, navigateNext, clearSelection, calendar.hoveredDate, handleDateClick]);

  return {
    ...calendar,
    calendarGrid,
    handleDateClick,
    handleDateHover,
    handleDateLeave,
    navigatePrevious,
    navigateNext,
    changeViewMode,
    goToToday,
    clearSelection,
    handleKeyDown,
    isSelecting,
  };
};
