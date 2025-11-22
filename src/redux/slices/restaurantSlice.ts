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
  id?: string;
  _id?: string;
  name: string;
  description: string;
  price: number;
  type: "veg" | "non-veg" | string;
  image: string;
  categoryId?: ProductCategory;
  category?: {
    id: string;
    name: string;
    description: string;
  };
  restaurantId?: ProductRestaurant;
  isActive?: boolean;
  created_at?: string;
  createdAt?: string;
  updated_at?: string;
  updatedAt?: string;
  __v?: number;
  quantity?: number;
}

export interface RestaurantDetails {
  id: string;
  name: string;
  description: string;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
    fullAddress: string;
  };
  location: {
    type: string;
    coordinates: [number, number];
  };
  latitude: number;
  longitude: number;
  owner: {
    name: string;
    email: string;
    phone: string;
  };
  contactEmail: string;
  contactPhone: string;
  website: string;
  cuisineType: string[];
  priceRange: string;
  capacity: number;
  openingHours: Record<string, { open: string; close: string }>;
  features: string[];
  images: Array<{
    _id: string;
    url: string;
    caption: string;
    isPrimary: boolean;
  }>;
  businessDocuments?: any;
  verificationStatus: string;
  isActive: boolean;
  isVerified: boolean;
  rating: {
    average: number;
    count: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface RestaurantDetailsResponse {
  success: boolean;
  message: string;
  restaurant: RestaurantDetails;
  itemsList: ProductItem[];
  itemsCount: number;
  itemsLimit: number;
}

export interface Restaurant {
  _id: string;
  name: string;
  description: string;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
    fullAddress: string;
  };
  location: {
    type: string;
    coordinates: [number, number];
  };
  latitude: number;
  longitude: number;
  owner: {
    name: string;
    email: string;
    phone: string;
  };
  contactEmail: string;
  contactPhone: string;
  website: string;
  cuisineType: string[];
  priceRange: string;
  capacity: number;
  openingHours: Record<string, { open: string; close: string }>;
  features: string[];
  images: Array<{
    _id: string;
    url: string;
    caption: string;
    isPrimary: boolean;
  }>;
  verificationStatus: string;
  isActive: boolean;
  isVerified: boolean;
  rating: {
    average: number;
    count: number;
  };
  created_at?: string;
  updated_at?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface RestaurantsResponse {
  success: boolean;
  data: Restaurant[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

// --------------------
// Async Thunk
// --------------------

export const fetchAllRestraurantProducts = createAsyncThunk(
  "restaurants/fetchAllProducts",
  async (restaurantId: string, { rejectWithValue }) => {
    try {
      const endpoint = `${ENDPOINTS.RESTAURANT_PRODUCTS}${restaurantId}`;
      console.log("Fetching restaurant from endpoint:", endpoint);
      const { data } = await api.get(endpoint);
      console.log("Fetched restaurant details:", data);
      return data;
    } catch (error: any) {
      console.error("Error fetching restaurants:", error);
      console.error("Error response:", error.response?.data);
      return rejectWithValue(error.response?.data?.message || "Failed to load restaurants");
    }
  }
);
export const fetchRestaurants = createAsyncThunk(
  "restaurants/fetchRestaurants",
  async (params: { latitude?: number; longitude?: number; raduis?: number } | undefined = undefined, { rejectWithValue }) => {
    try {
      let endpoint = ENDPOINTS.ALL_RESTAURANTS;
      
      // Build query parameters if location data is provided
      // Using 'lat' and 'lng' as per API requirement
      if (params && (params.latitude || params.longitude)) {
        const queryParams = new URLSearchParams();
        if (params.latitude) queryParams.append("lat", params.latitude.toString());
        if (params.longitude) queryParams.append("lng", params.longitude.toString());
        if (params.raduis) queryParams.append("raduis", params.raduis.toString());
        
        const queryString = queryParams.toString();
        if (queryString) {
          endpoint = `${ENDPOINTS.ALL_RESTAURANTS}?${queryString}`;
        }
      }
      
      console.log("Fetching restaurants from:", endpoint);
      const { data } = await api.get(endpoint);
      console.log("Fetched all restaurants:", data);
      return data;
    } catch (error: any) {
      console.error("Error fetching restaurants:", error);
      return rejectWithValue(error.response?.data?.message || "Failed to load restaurants");
    }
  }
);

export const fetchNearByRestraurant = createAsyncThunk(
  "restaurants/fetchNearByRestraurant",
  async (body: { latitude: number; longitude: number; raduis: number }, { rejectWithValue }) => {
    try {
      const { data } = await api.post(ENDPOINTS.NEAR_BY_RESTUARANT, {
        latitude: body.latitude,
        longitude: body.longitude,
        raduis: body.raduis || 2000
      });
      console.log("Fetched nearby restaurants:", data);
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
  restaurantDetails: RestaurantDetails | null;
  restaurants: Restaurant[];
  nearByRestuarant: Restaurant[];
  itemsCount: number;
  itemsLimit: number;
}

const initialState: ProductState = {
  loading: false,
  error: null,
  restaurantProducts: [],
  restaurantDetails: null,
  restaurants: [],
  nearByRestuarant: [],
  itemsCount: 0,
  itemsLimit: 0,
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
      state.restaurantDetails = null;
      state.error = null;
      state.restaurants = [];
      state.nearByRestuarant = [];
      state.itemsCount = 0;
      state.itemsLimit = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllRestraurantProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllRestraurantProducts.fulfilled, (state, action: PayloadAction<RestaurantDetailsResponse | any>) => {
        state.loading = false;
        console.log("Full API Response:", action.payload);
        
        // Handle different response structures
        const response = action.payload;
        const itemsList = response?.itemsList || response?.data?.itemsList || [];
        const restaurant = response?.restaurant || response?.data?.restaurant;
        
        console.log("Items List:", itemsList);
        console.log("Restaurant:", restaurant);
        
        // Map itemsList to restaurantProducts with proper structure
        state.restaurantProducts = itemsList.map((item: any) => ({
          ...item,
          _id: item.id || item._id || item._id,
          id: item.id || item._id || item._id,
        }));
        
        // Store restaurant details
        state.restaurantDetails = restaurant || null;
        state.itemsCount = response?.itemsCount || response?.data?.itemsCount || 0;
        state.itemsLimit = response?.itemsLimit || response?.data?.itemsLimit || 0;
        
        console.log("Mapped Products:", state.restaurantProducts);
        console.log("Restaurant Details:", state.restaurantDetails);
      })
      .addCase(fetchAllRestraurantProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchRestaurants.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRestaurants.fulfilled, (state, action: PayloadAction<RestaurantsResponse | any>) => {
        state.loading = false;
        // Handle response structure: { success, data, pagination }
        const response = action.payload;
        state.restaurants = response?.data || response || [];
        console.log("Fetched restaurants:", state.restaurants);
      })
      .addCase(fetchRestaurants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchNearByRestraurant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNearByRestraurant.fulfilled, (state, action: PayloadAction<Restaurant[]>) => {
        state.loading = false;
        state.nearByRestuarant = action.payload || [];
      })
      .addCase(fetchNearByRestraurant.rejected, (state, action) => {
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
