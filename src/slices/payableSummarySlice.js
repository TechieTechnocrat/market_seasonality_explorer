import { createSlice } from "@reduxjs/toolkit";
import { initialState } from "../redux/initialState";

const isProtectedValue = (value) => {
  return value && typeof value === "string" && /^x+$/i.test(value.trim());
};

const payableSummarySlice = createSlice({
  name: "payableSummary",
  initialState: initialState.payment.summary,
  reducers: {
    updatePayorDetails: (state, action) => {
      state.payor_details = { ...state.payor_details, ...action.payload };
    },

    setEditedDetails: (state, action) => {
      state.editedDetails = { ...state.editedDetails, ...action.payload };
    },

    setErrors: (state, action) => {
      state.errors = action.payload;
    },

    setTouched: (state, action) => {
      state.touched = { ...state.touched, ...action.payload };
    },

    // New reducer actions for isPayorDetailEdit
    enablePayorDetailEdit: (state, action) => {
      state.isPayorDetailEdit = true;
      // Initialize editedDetails with current payor_details when entering edit mode
      if (action.payload) {
        // Clear protected values from the payload
        const cleanedPayload = {};
        Object.entries(action.payload).forEach(([key, value]) => {
          cleanedPayload[key] = isProtectedValue(value) ? "" : value;
        });
        state.editedDetails = { ...cleanedPayload };
      } else {
        // Clear protected values from payor_details
        const cleanedDetails = {};
        Object.entries(state.payor_details || {}).forEach(([key, value]) => {
          cleanedDetails[key] = isProtectedValue(value) ? "" : value;
        });
        state.editedDetails = { ...cleanedDetails };
      }
      // Clear errors and touched state when entering edit mode
      state.errors = {};
      state.touched = {};
    },

    disablePayorDetailEdit: (state) => {
      state.isPayorDetailEdit = false;
      // Clear editedDetails when exiting edit mode
      state.editedDetails = {};
      // Clear errors and touched state
      state.errors = {};
      state.touched = {};
    },

    savePayorDetails: (state) => {
      // Update payor_details with editedDetails
      state.payor_details = { ...state.payor_details, ...state.editedDetails };
      // Exit edit mode
      state.isPayorDetailEdit = false;
      // Clear temporary state
      state.editedDetails = {};
      state.errors = {};
      state.touched = {};
    },

    cancelPayorDetailEdit: (state) => {
      // Exit edit mode without saving
      state.isPayorDetailEdit = false;
      // Clear temporary state
      state.editedDetails = {};
      state.errors = {};
      state.touched = {};
    },

    updateEditedDetails: (state, action) => {
      // Clear protected values when updating edited details
      const cleanedPayload = {};
      Object.entries(action.payload).forEach(([key, value]) => {
        cleanedPayload[key] = isProtectedValue(value) ? "" : value;
      });
      state.editedDetails = { ...state.editedDetails, ...cleanedPayload };
    },

    updateSingleEditedDetail: (state, action) => {
      const { fieldKey, value } = action.payload;
      // Clear protected values
      const cleanedValue = isProtectedValue(value) ? "" : value;
      state.editedDetails = {
        ...state.editedDetails,
        [fieldKey]: cleanedValue,
      };
    },

    setFieldError: (state, action) => {
      const { fieldKey, error } = action.payload;
      state.errors = { ...state.errors, [fieldKey]: error };
    },

    setAllErrors: (state, action) => {
      state.errors = action.payload;
    },

    setFieldTouched: (state, action) => {
      const { fieldKey } = action.payload;
      state.touched = { ...state.touched, [fieldKey]: true };
    },

    setAllTouched: (state, action) => {
      state.touched = action.payload;
    },

    clearFieldError: (state, action) => {
      const { fieldKey } = action.payload;
      const newErrors = { ...state.errors };
      delete newErrors[fieldKey];
      state.errors = newErrors;
    },

    // Reset entire state
    resetPayableSummary: (state) => {
      return initialState.payment.summary;
    },
  },
  extraReducers(builder) {},
});

export const {
  updatePayorDetails,
  setEditedDetails,
  setErrors,
  setTouched,
  enablePayorDetailEdit,
  disablePayorDetailEdit,
  savePayorDetails,
  cancelPayorDetailEdit,
  updateEditedDetails,
  updateSingleEditedDetail,
  setFieldError,
  setAllErrors,
  setFieldTouched,
  setAllTouched,
  clearFieldError,
  resetPayableSummary,
} = payableSummarySlice.actions;
export const payableSummaryReducer = payableSummarySlice.reducer;
