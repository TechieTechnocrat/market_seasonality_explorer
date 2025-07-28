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
