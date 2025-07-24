import React from 'react';

export const OrderbookSymbolSelector = ({ availableSymbols, onSelect }) => {
  return (
    <select onChange={(e) => onSelect(e.target.value)}>
      {availableSymbols.map((sym) => (
        <option key={sym} value={sym}>{sym}</option>
      ))}
    </select>
  );
}
