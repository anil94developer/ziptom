import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { ENDPOINTS } from "./../../api/endPoint"; // adjust import path as per your project
import api from "../../api/axiosConfig";

// ==========================
// Coupon Type
// ==========================
export interface Coupon {
  _id: string;
  name: string;
  code: string;
  description: string;
  image: string;
  discountType: string;
  discountValue: number;
  minOrderAmount: number;
  maxDiscountAmount: number;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
  status: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// ==========================
// Slice State
// ==========================
interface CouponState {
  coupons: Coupon[];
  loading: boolean;
  error: string | null;
}

const initialState: CouponState = {
  coupons: [],
  loading: false,
  error: null,
};

// ==========================
// Async Thunk
// ==========================
export const getCoupons = createAsyncThunk(
  "coupon/getCoupons",
  async (_, { rejectWithValue }) => {
    try {
      const {data} = await api.get(ENDPOINTS.GET_COUPONS);
      return data?.data || data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Something went wrong");
    }
  }
);

// ==========================
// Slice
// ==========================
const couponSlice = createSlice({
  name: "coupon",
  initialState,
  reducers: {
    clearCoupons: (state) => {
      state.coupons = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCoupons.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCoupons.fulfilled, (state, action: PayloadAction<Coupon[]>) => {
        state.loading = false;
        state.coupons = action.payload;
      })
      .addCase(getCoupons.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCoupons } = couponSlice.actions;
export default couponSlice.reducer;
