import React from 'react';
import { OrderbookContainer } from './OrderbookContainer';
import { useInstrumentHook } from '../../hooks/useInstrumentHook';

const OrderbookConsole = () => {
  const { availableSymbols  } = useInstrumentHook();

  return (
    <div>
    <OrderbookContainer availableSymbols={availableSymbols}/>
    </div>
  );
};

export default OrderbookConsole;
