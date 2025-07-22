import React from 'react';
import useOrderbookHook from '../../hooks/useOrderbookHook';

const OrderbookConsole = () => {
  const { orderbookData, loading, error } = useOrderbookHook('BTCUSDT');

  return (
    <div>
      <h3>Binance Orderbook - Console Logged</h3>
      {loading && <p>Loading orderbook...</p>}
      {error && <p>Error: {error}</p>}
      {orderbookData && <pre>{JSON.stringify(orderbookData, null, 2)}</pre>}
    </div>
  );
};

export default OrderbookConsole;
