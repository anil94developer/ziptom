import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { ENDPOINTS } from "../../api/endPoint";

interface OrderItem {
  id: number; // product ID
  quantity: number;
}

interface OrderState {
  orders: any[]; // store created orders
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  orders: [],
  loading: false,
  error: null,
};

// Async thunk to create order
export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (orderData: {
    payment_method: string;
    coupon_code?: string;
    delivery_charges: number;
    tax_amount: number;
    total_amount: number;
    address_id: number;
    items: number[];
  }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${ENDPOINTS.CREATE_ORDER}`, orderData);
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.orders.push(action.payload);
      })
      .addCase(createOrder.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearOrders } = orderSlice.actions;
export default orderSlice.reducer;
