import { configureStore } from "@reduxjs/toolkit";
import calendarReducer from "../slices/calendarSlice";
import orderbookReducer from "../slices/orderBookSlice";

import instrumentReducer from "../slices/instrumentSlice";

export const store = configureStore({
  reducer: {
    calendar: calendarReducer,
    instrument: instrumentReducer,
    orderbook: orderbookReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),

  devTools: true,
});
