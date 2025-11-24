import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { ENDPOINTS } from "./../../api/endPoint";
import api from "../../api/axiosConfig";

// ==========================
// Coupon Type
// ==========================
export interface Coupon {
  id: string;
  _id?: string; // For backward compatibility
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
  isAvailable: boolean;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
  restaurant?: {
    id: string;
    name: string;
    address: {
      street: string;
      city: string;
      state: string;
      pincode: string;
      country: string;
      fullAddress: string;
    };
  };
}

// ==========================
// Validated Coupon Type
// ==========================
export interface ValidatedCoupon extends Coupon {
  restaurant?: {
    id: string;
    name: string;
  };
}

// ==========================
// Slice State
// ==========================
interface CouponState {
  coupons: Coupon[];
  validatedCoupon: ValidatedCoupon | null;
  loading: boolean;
  validating: boolean;
  error: string | null;
}

const initialState: CouponState = {
  coupons: [],
  validatedCoupon: null,
  loading: false,
  validating: false,
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
      console.log("Coupons API Response:", data);
      // Handle response structure: { success, status, message, data: { coupons: [...], pagination: {...} } }
      const coupons = data?.data?.coupons || data?.coupons || data?.data || data || [];
      return coupons;
    } catch (error: any) {
      console.error("Error fetching coupons:", error);
      return rejectWithValue(error.response?.data?.message || "Something went wrong");
    }
  }
);

export const validateCoupon = createAsyncThunk(
  "coupon/validateCoupon",
  async (params: { couponCode: string; restaurantId: string }, { rejectWithValue }) => {
    try {
      const { data } = await api.post(ENDPOINTS.VALIDATE_COUPON, {
        couponCode: params.couponCode,
        restaurantId: params.restaurantId,
      });
      console.log("Validate Coupon API Response:", data);
      // Handle response structure: { success, status, message, data: {...} }
      const coupon = data?.data || data;
      return coupon;
    } catch (error: any) {
      console.error("Error validating coupon:", error);
      return rejectWithValue(error.response?.data?.message || "Invalid coupon code");
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
    clearValidatedCoupon: (state) => {
      state.validatedCoupon = null;
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
        // Map coupons to ensure consistent id field
        state.coupons = (action.payload || []).map((coupon: any) => ({
          ...coupon,
          id: coupon.id || coupon._id,
          _id: coupon._id || coupon.id,
        }));
      })
      .addCase(getCoupons.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(validateCoupon.pending, (state) => {
        state.validating = true;
        state.error = null;
      })
      .addCase(validateCoupon.fulfilled, (state, action: PayloadAction<any>) => {
        state.validating = false;
        state.validatedCoupon = {
          ...action.payload,
          id: action.payload.id || action.payload._id,
          _id: action.payload._id || action.payload.id,
        };
      })
      .addCase(validateCoupon.rejected, (state, action: PayloadAction<any>) => {
        state.validating = false;
        state.validatedCoupon = null;
        state.error = action.payload;
      });
  },
});

export const { clearCoupons, clearValidatedCoupon } = couponSlice.actions;
export default couponSlice.reducer;
