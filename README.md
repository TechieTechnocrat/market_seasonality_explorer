Market Seasonality Explorer
Overview
This project implements an interactive, multi-timeframe calendar dashboard for visualizing the volatility, liquidity, and price performance of financial assets, as specified in the GoQuant assignment.

Key Features
Interactive Calendar with smooth daily/weekly/monthly/range views.

Volatility Heatmap: Calendar cells color-coded green/yellow/red.

Liquidity Visualization: Bar height + pattern for trading volume.

Performance Metrics: Price change arrows (up = green, down = red).

Keyboard Navigation (arrow keys, Enter, Escape).

Smooth Transitions and Animations between views.

Date Range Picker Modal for custom analysis periods.

Filter Controls (volatility, volume, price change).

Zoom Controls for cell detail or overview.

Dashboard Side Panel: Detailed price stats, OHLC, trades, volatility, intraday/aggregate charts.

Recharts visualizations (bar/line/trend charts).

Export Functionality (calendar as image).

Accessible (ARIA, keyboard, color contrast).

Responsive Design for all devices.

Error/Edge-Case Handling.

Folder Structure/Modularity
/components/

MarketSeasonalityExplorer.jsx: Main calendar dashboard.

AppHeader.jsx: Asset selector, mode controls, actions.

CalendarCell.jsx: Modular calendar cell, fully visualized.

DateRangePickerModal.jsx: Modal for custom range picking.

ModalSide.jsx: Side panel with stat cards and charts.

CalendarFilters.jsx: Volatility/Volume/Performance filter bar.

(Add more for future breakdown).

/redux/

calendarSlice.js: Calendar/timescale/date state.

instrumentSlice.js: Symbol, filters, current price, etc.

initialState.js: Initial redux state for clarity.

/external/api.js: Data loading, stubbed for easy real-time swap with crypto APIs (Binance, etc).

State & Data Flow
Uses Redux Toolkit for state: calendar, instrument, filters, and modal.

Calendar keys are always formatted as YYYY-MM-DD built from local date fields (to avoid timezone bugs).

Redux actions for date navigation, zoom, filters, and calendar view.

How To Run Locally
Clone the repo (private):

text
git clone https://github.com/<YourUsername>/market_seasonality_explorer.git
cd market_seasonality_explorer
Install dependencies:

text
npm install
Start dev server:

text
npm run dev
Open the local address as shown in your terminal (usually http://localhost:5173).

To Build for Production (export)

text
npm run build
See /dist for output.