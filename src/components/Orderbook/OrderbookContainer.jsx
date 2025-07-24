import React, { useState } from 'react';
import { useOrderbook } from '../../hooks/useOrderbookHook';
import { OrderbookSymbolSelector } from './OrderbookSymbolSelector';
import { OrderbookTable } from './OrderbookTable';

export const OrderbookContainer = ({ availableSymbols }) => {
  const [selectedSymbol, setSelectedSymbol] = useState(availableSymbols?.[0] || 'BTCUSDT');
  const {
    bids, asks, lastUpdateId, isLoading, error, timestamp
  } = useOrderbook(selectedSymbol);

  return (
    <div>
      <OrderbookSymbolSelector
        availableSymbols={availableSymbols}
        onSelect={setSelectedSymbol}
      />
      {isLoading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      <OrderbookTable bids={bids} asks={asks} />
      {timestamp && (
        <div>Last refreshed: {new Date(timestamp).toLocaleTimeString()}</div>
      )}
    </div>
  );
}
