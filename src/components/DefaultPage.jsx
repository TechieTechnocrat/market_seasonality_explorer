import React from 'react'
import OrderbookConsole from './Orderbook/OrderbookConsole'
import { AppHeader } from './AppHeader'
import { HomeLayout } from './HomeLayout'

export const DefaultPage = () => {
  return (
    <HomeLayout/>
    // <div><AppHeader/><MarketSeasonalityExplorer/></div>
  )
}
