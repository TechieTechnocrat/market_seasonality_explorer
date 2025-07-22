import { configureStore } from "@reduxjs/toolkit";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { Provider } from "react-redux";
import { mockInitialState } from "./mockInitialState";
import { orderbookReducer } from "../slices/orderBookSlice";

const createMockStore = (initialState) => {
  return configureStore({
    reducer: {
    orderbook: orderbookReducer
    },
  });
};

export const renderWithProvider = (component, state = mockInitialState) => {
  const store = createMockStore(state);
  return render(<Provider store={store}>{component}</Provider>);
};
