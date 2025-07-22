import { createSlice } from "@reduxjs/toolkit";
import { initialState } from "../redux/initialState";
import { fetchOrderbook } from "../external/api";

const orderbookSlice = createSlice({
  name: "orderbook",
  initialState: initialState.orderbook,
  reducers: {
     },
  extraReducers(builder) {
     builder
      .addCase(fetchOrderbook.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderbook.fulfilled, (state, action) => {
        state.loading = false;
        state.orderbookData = action.payload;
        console.log('Binance Orderbook Response:', action.payload); 
      })
      .addCase(fetchOrderbook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error;
        console.error('Orderbook fetch error:', action.payload);
      });
  },
});

export const {

} = orderbookSlice.actions;
export const orderbookReducer = orderbookSlice.reducer;
