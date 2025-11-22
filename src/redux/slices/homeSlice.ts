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

// Product query parameters interface
export interface ProductQueryParams {
  page?: number;
  limit?: number;
  categoryId?: string;
  search?: string;
}

// Products API response interface
export interface ProductsResponse {
  success: boolean;
  data: NineNineProduct[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

// Fetch all 99 products (legacy endpoint)
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

// Fetch products with filters and pagination
export const fetchProducts = createAsyncThunk(
  "home/fetchProducts",
  async (params: ProductQueryParams = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append("page", params.page.toString());
      if (params.limit) queryParams.append("limit", params.limit.toString());
      if (params.categoryId) queryParams.append("categoryId", params.categoryId);
      if (params.search) queryParams.append("search", params.search);
      
      const queryString = queryParams.toString();
      const endpoint = queryString 
        ? `${ENDPOINTS.PRODUCTS}?${queryString}`
        : ENDPOINTS.PRODUCTS;
      
      console.log("Fetching products from:", endpoint);
      const { data } = await api.get(endpoint);
      console.log("Products API Response:", data);
      
      return {
        products: data?.data || data || [],
        pagination: data?.pagination || null,
        append: params.page ? params.page > 1 : false, // Append if page > 1
      };
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
  vegType: boolean;
  // Pagination state
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  // Filter state
  searchQuery: string;
  selectedCategoryId: string | null;
}

const initialState: HomeState = {
  loading: false,
  error: null,
  products: [],
  categories: [],
  restaurants: [],
  vegType: true,
  // Pagination
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
  itemsPerPage: 20,
  hasNextPage: false,
  hasPrevPage: false,
  // Filters
  searchQuery: "",
  selectedCategoryId: null,
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
      // Reset pagination
      state.currentPage = 1;
      state.totalPages = 1;
      state.totalItems = 0;
      state.hasNextPage = false;
      state.hasPrevPage = false;
      // Reset filters
      state.searchQuery = "";
      state.selectedCategoryId = null;
    },
    setVegType: (state, action: PayloadAction<boolean>) => {
      state.vegType = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.currentPage = 1; // Reset to first page on search
    },
    setSelectedCategoryId: (state, action: PayloadAction<string | null>) => {
      state.selectedCategoryId = action.payload;
      state.currentPage = 1; // Reset to first page on category change
    },
    resetPagination: (state) => {
      state.currentPage = 1;
      state.products = [];
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

      // Fetch Products with filters and pagination
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<{ products: NineNineProduct[]; pagination: any; append: boolean }>) => {
        state.loading = false;
        
        if (action.payload.append) {
          // Append products for pagination
          state.products = [...state.products, ...action.payload.products];
        } else {
          // Replace products for new search/filter
          state.products = action.payload.products;
        }
        
        // Update pagination state
        if (action.payload.pagination) {
          state.currentPage = action.payload.pagination.currentPage || 1;
          state.totalPages = action.payload.pagination.totalPages || 1;
          state.totalItems = action.payload.pagination.totalItems || 0;
          state.itemsPerPage = action.payload.pagination.itemsPerPage || 20;
          state.hasNextPage = action.payload.pagination.hasNextPage || false;
          state.hasPrevPage = action.payload.pagination.hasPrevPage || false;
        }
      })
      .addCase(fetchProducts.rejected, (state, action) => {
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

export const { 
  clearHomeData, 
  setVegType, 
  setSearchQuery, 
  setSelectedCategoryId, 
  resetPagination 
} = homeSlice.actions;
export default homeSlice.reducer;
