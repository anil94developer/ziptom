// src/redux/slices/toastSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  message: "",
  type: null, // 'success' | 'error'
  visible: false,
};

const toastSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    showToast: (state, action) => {
      state.message = action.payload.message;
      state.type = action.payload.type;
      state.visible = true;
    },
    hideToast: (state) => {
      state.visible = false;
      state.message = "";
      state.type = null;
    },
  },
});

export const { showToast, hideToast } = toastSlice.actions;
export default toastSlice.reducer;
