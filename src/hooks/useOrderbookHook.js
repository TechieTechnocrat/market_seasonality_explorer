import { useSelector, useDispatch } from 'react-redux';
import {  setSymbol } from '../slices/orderBookSlice';
import { useEffect } from 'react';
import { fetchOrderbook } from '../external/api';

export function useOrderbook(symbol) {
  const dispatch = useDispatch();
  const {
    bids,
    asks,
    lastUpdateId,
    isLoading,
    error,
    timestamp,
    symbol: stateSymbol,
  } = useSelector((state) => state.orderbook);

  useEffect(() => {
    if (symbol) {
      dispatch(setSymbol(symbol));
      dispatch(fetchOrderbook(symbol));
      const interval = setInterval(() => {
        dispatch(fetchOrderbook(symbol));
      }, 2500); 
      return () => clearInterval(interval);
    }
  }, [dispatch, symbol]);

  return { bids, asks, lastUpdateId, isLoading, error, timestamp, stateSymbol };
}
