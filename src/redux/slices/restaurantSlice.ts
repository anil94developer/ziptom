// src/store/slices/restaurantSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "../../api/axiosConfig";
import { ENDPOINTS } from "../../api/endPoint";

// --------------------
// Interfaces
// --------------------

export interface ProductRestaurant {
  _id: string;
  name: string;
}

export interface ProductCategory {
  isActive: boolean;
  _id: string;
  name: string;
  description: string;
  isVegetarian: boolean;
  image: string;
  created_at: string;
  updated_at: string;
  __v: number;
}

export interface ProductItem {
  isActive: boolean;
  _id: string;
  name: string;
  description: string;
  price: number;
  type: "veg" | "non-veg"; // or string if unknown
  categoryId: ProductCategory;
  restaurantId: ProductRestaurant;
  created_at: string;
  updated_at: string;
  __v: number;
  quantity?: number; // optional if used for cart
}

// --------------------
// Async Thunk
// --------------------

export const fetchAllRestraurantProducts = createAsyncThunk(
  "restaurants/fetchAllProducts",
  async (restaurantId: string, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`${ENDPOINTS.RESTAURANT_PRODUCTS}${restaurantId}`);
      console.log("Fetched restaurants:", data);
      return data?.data || data;
    } catch (error: any) {
      console.error("Error fetching restaurants:", error);
      return rejectWithValue(error.response?.data?.message || "Failed to load restaurants");
    }
  }
);


// --------------------
// Redux State
// --------------------

interface ProductState {
  loading: boolean;
  error: string | null;
  restaurantProducts: ProductItem[];
}

const initialState: ProductState = {
  loading: false,
  error: null,
  restaurantProducts: [],
};

// --------------------
// Slice
// --------------------

const restaurantSlice = createSlice({
  name: "restaurants",
  initialState,
  reducers: {
    clearProductData: (state) => {
      state.restaurantProducts = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllRestraurantProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllRestraurantProducts.fulfilled, (state, action: PayloadAction<ProductItem[]>) => {
        state.loading = false;
        state.restaurantProducts = action.payload;
      })
      .addCase(fetchAllRestraurantProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// --------------------
// Exports
// --------------------

export const { clearProductData } = restaurantSlice.actions;
export default restaurantSlice.reducer;
