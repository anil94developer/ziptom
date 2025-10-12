import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "../../api/axiosConfig";
import { ENDPOINTS } from "../../api/endPoint";

// --------------------
// Interfaces
// --------------------

export interface Restaurant {
  _id: string;
  name: string;
  description: string;
  cuisineType: string[];
  rating: {
    average: number;
    count: number;
  };
  priceRange: string;
  capacity: number;
  contactEmail: string;
  contactPhone: string;
  website: string;
  location: {
    type: string;
    coordinates: [number, number];
  };
  openingHours: Record<
    string,
    {
      open: string;
      close: string;
    }
  >;
  features: string[];
  verificationStatus: string;
  isActive: boolean;
  isVerified: boolean;
  owner: {
    name: string;
    email: string;
    phone: string;
  };
  images: {
    isPrimary: boolean;
    url: string;
    caption: string;
  }[];
  created_at: string;
  updated_at: string;
}

export interface Category {
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

export interface NineNineProduct {
  isActive: boolean;
  _id: string;
  name: string;
  description: string;
  price: number;
  categoryId: Category;
  image: string;
  __v: number;
  quantity?: number;
}

// --------------------
// Async Thunks
// --------------------

// Fetch all 99 products
export const fetchNineNineProducts = createAsyncThunk(
  "home/fetchNineNineProducts",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get(ENDPOINTS.NINE_NINE_PRODUCTS);
      console.log("Products API Response:", data);
      return data?.data || data;
    } catch (error: any) {
      console.error("Error fetching products:", error);
      return rejectWithValue(error.response?.data?.message || "Failed to load products");
    }
  }
);

// Fetch categories (only vegetarian)
export const fetchCategories = createAsyncThunk(
  "home/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`${ENDPOINTS.CATEGORY}?isveg=true`);
      console.log("Categories API Response:", data);
      return data?.data || data;
    } catch (error: any) {
      console.error("Error fetching categories:", error);
      return rejectWithValue(error.response?.data?.message || "Failed to load categories");
    }
  }
);

// ✅ New: Fetch Restaurants
export const fetchRestaurants = createAsyncThunk(
  "home/fetchRestaurants",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get(ENDPOINTS.RESTAURANTS); // e.g. /api/app/auth/restaurants
      console.log("Restaurants API Response:", data);
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

interface HomeState {
  loading: boolean;
  error: string | null;
  products: NineNineProduct[];
  categories: Category[];
  restaurants: Restaurant[];
}

const initialState: HomeState = {
  loading: false,
  error: null,
  products: [],
  categories: [],
  restaurants: [],
};

// --------------------
// Slice
// --------------------

const homeSlice = createSlice({
  name: "home",
  initialState,
  reducers: {
    clearHomeData: (state) => {
      state.products = [];
      state.categories = [];
      state.restaurants = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Products
      .addCase(fetchNineNineProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNineNineProducts.fulfilled, (state, action: PayloadAction<NineNineProduct[]>) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchNineNineProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Categories
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action: PayloadAction<Category[]>) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ✅ Restaurants
      .addCase(fetchRestaurants.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRestaurants.fulfilled, (state, action: PayloadAction<Restaurant[]>) => {
        state.loading = false;
        state.restaurants = action.payload;
      })
      .addCase(fetchRestaurants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// --------------------
// Exports
// --------------------

export const { clearHomeData } = homeSlice.actions;
export default homeSlice.reducer;
