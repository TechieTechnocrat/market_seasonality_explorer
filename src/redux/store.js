import { configureStore } from "@reduxjs/toolkit";

import { orderbookReducer } from "../slices/orderBookSlice";

export const store = configureStore({
  reducer: {
    orderbook: orderbookReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: true,
});
