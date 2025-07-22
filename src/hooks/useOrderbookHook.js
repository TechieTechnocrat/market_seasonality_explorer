import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderbook } from '../external/api';
import { ssrDynamicImportKey } from 'vite/runtime';

const useOrderbookHook = (symbol = 'BTCUSDT') => {
  const dispatch = useDispatch();
  const { orderbookData, loading, error } = useSelector(
    (state) => state.orderbook
  );

  useEffect(() => {
    console.log(symbol)
    dispatch(fetchOrderbook(symbol));
  }, [symbol, dispatch]);

  return { orderbookData, loading, error };
};

export default useOrderbookHook;
