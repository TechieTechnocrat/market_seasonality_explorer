import { createSlice } from "@reduxjs/toolkit";
import { initialState } from "../redux/initialState";

const globalSlice = createSlice({
  name: "global",
  initialState: initialState.global,
  reducers: {
    updatePayorFieldConfigs: (state, action) => {
      state.payorFieldConfigs = {
        ...state.payorFieldConfigs,
        ...action.payload,
      };
    },
    addPayorFieldConfig: (state, action) => {
      const { fieldKey, config } = action.payload;
      state.payorFieldConfigs[fieldKey] = config;
    },
    removePayorFieldConfig: (state, action) => {
      delete state.payorFieldConfigs[action.payload];
    },
  },
  extraReducers(builder) {},
});

export const {
  updatePayorFieldConfigs,
  addPayorFieldConfig,
  removePayorFieldConfig,
} = globalSlice.actions;
export const globalReducer = globalSlice.reducer;
