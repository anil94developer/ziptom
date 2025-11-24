import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { ENDPOINTS } from "../../api/endPoint";
import api from "../../api/axiosConfig";

export interface OrderItem {
  _id: string;
  productId: {
    _id: string;
    name: string;
    type: string;
    image: string;
  };
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface Order {
  _id: string;
  userId: string | {
    _id: string;
    mobileNumber: string;
    name: string;
  };
  restaurantId: {
    _id: string;
    name: string;
    address: {
      street: string;
      city: string;
      state: string;
      pincode: string;
      country: string;
      fullAddress: string;
    };
    contactPhone?: string;
  };
  items: OrderItem[];
  totalAmount: number;
  couponId: any;
  couponCode: string | null;
  discountAmount: number;
  finalAmount: number;
  deliveryCharge: number;
  taxes: number;
  grandTotal: number;
  paymentMethod: string;
  status: string;
  deliveryAddressId: string;
  deliveryAddress: {
    id: string;
    label: string;
    address: string;
    city: string;
    country: string;
    landmark?: string;
    fullAddress: string;
  };
  notes: string;
  orderId: string;
  isActive: boolean;
  created_at: string;
  updated_at: string;
}

interface OrderState {
  orders: Order[]; // store fetched orders
  orderDetails: Order | null; // store single order details
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  } | null;
  loading: boolean;
  loadingDetails: boolean;
  error: string | null;
}

const initialState: OrderState = {
  orders: [],
  orderDetails: null,
  pagination: null,
  loading: false,
  loadingDetails: false,
  error: null,
};

// Async thunk to fetch orders
export const fetchOrders = createAsyncThunk(
  "order/fetchOrders",
  async (params: { page?: number; limit?: number } = {}, { rejectWithValue }) => {
    try {
      const { page = 1, limit = 50 } = params;
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      const response = await api.get(`${ENDPOINTS.PLACE_ORDER}?${queryParams.toString()}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

// Async thunk to fetch single order details
export const fetchOrderDetails = createAsyncThunk(
  "order/fetchOrderDetails",
  async (orderId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`${ENDPOINTS.PLACE_ORDER}/${orderId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

// Async thunk to create order
export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (orderData: {
    restaurantId: string;
    items: Array<{
      productId: string;
      quantity: number;
    }>;
    deliveryAddressId: string;
    paymentMethod: string;
    deliveryCharge?: number;
    taxPercentage?: number;
    couponCode?: string;
  }, { rejectWithValue }) => {
    try {
      const response = await api.post(`${ENDPOINTS.PLACE_ORDER}`, orderData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    clearOrders: (state) => {
      state.orders = [];
      state.error = null;
    },
    clearOrderDetails: (state) => {
      state.orderDetails = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Orders
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        const response = action.payload;
        if (response?.data?.orders) {
          state.orders = response.data.orders;
          state.pagination = response.data.pagination || null;
        } else if (Array.isArray(response?.data)) {
          state.orders = response.data;
        } else {
          state.orders = [];
        }
      })
      .addCase(fetchOrders.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Order
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        // Optionally add the new order to the list
        if (action.payload?.data) {
          state.orders.unshift(action.payload.data);
        }
      })
      .addCase(createOrder.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Order Details
      .addCase(fetchOrderDetails.pending, (state) => {
        state.loadingDetails = true;
        state.error = null;
      })
      .addCase(fetchOrderDetails.fulfilled, (state, action: PayloadAction<any>) => {
        state.loadingDetails = false;
        const response = action.payload;
        if (response?.data?.order) {
          state.orderDetails = response.data.order;
        } else if (response?.data) {
          state.orderDetails = response.data;
        } else {
          state.orderDetails = null;
        }
      })
      .addCase(fetchOrderDetails.rejected, (state, action: PayloadAction<any>) => {
        state.loadingDetails = false;
        state.error = action.payload;
      });
  },
});

export const { clearOrders, clearOrderDetails } = orderSlice.actions;
export default orderSlice.reducer;
