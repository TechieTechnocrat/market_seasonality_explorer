import React from 'react'
import OrderbookConsole from './Orderbook/OrderbookConsole'
import MarketSeasonalityExplorer from './Calendar/MarketSeasonalityExplorer'
import { AppHeader } from './AppHeader'

export const DefaultPage = () => {
  return (
    <div><AppHeader/><MarketSeasonalityExplorer/></div>
  )
}
