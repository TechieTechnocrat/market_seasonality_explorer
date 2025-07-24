import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setSelectedSymbol,
  setFilters,
  clearError,
} from "../slices/instrumentSlice";
import {
  fetch24hrStats,
  fetchKlineData,
  fetchCurrentPrice,
  fetchMultipleSymbols,
  fetchExchangeInfo,
} from "../external/api";

export const useInstrumentHook = () => {
  const dispatch = useDispatch();
  const instrument = useSelector((state) => state.instrument);

  const changeSymbol = useCallback(
    (symbol) => {
      dispatch(setSelectedSymbol(symbol));
      dispatch(fetchCurrentPrice(symbol));
      dispatch(fetch24hrStats(symbol));
      dispatch(fetchKlineData({ symbol, interval: "1d", limit: 30 }));
    },
    [dispatch]
  );

  const updateFilters = useCallback(
    (newFilters) => {
      dispatch(setFilters(newFilters));
    },
    [dispatch]
  );

  const loadSymbolData = useCallback(
    (symbol = instrument.selectedSymbol) => {
      dispatch(fetchCurrentPrice(symbol));
      dispatch(fetch24hrStats(symbol));
      dispatch(fetchKlineData({ symbol, interval: "1d", limit: 30 }));
    },
    [dispatch, instrument.selectedSymbol]
  );

  const loadMultipleSymbols = useCallback(
    (symbols) => {
      dispatch(fetchMultipleSymbols(symbols));
    },
    [dispatch]
  );
  const loadExchangeInfo = useCallback(() => {
    dispatch(fetchExchangeInfo());
  }, [dispatch]);
  return {
    ...instrument,
    loadMultipleSymbols,
    loadExchangeInfo,
    loadSymbolData,
    updateFilters,
    changeSymbol,
  };
};
