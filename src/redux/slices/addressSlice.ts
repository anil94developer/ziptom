import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { ENDPOINTS } from "../../api/endPoint";
import api from "../../api/axiosConfig";

interface Address {
  label: string;
  address: string;
  city: string;
  country: string;
  landmark: string;
}

interface AddressState {
  addresses: Address[];
  loading: boolean;
  error: string | null;
}

const initialState: AddressState = {
  addresses: [],
  loading: false,
  error: null,
};

// Async thunk to add a new address
export const addAddress = createAsyncThunk(
  "address/addAddress",
  async (
    newAddress,
    { rejectWithValue }
  ) => {
      
    try {
      const {data} = await api.post(ENDPOINTS.ADD_ADDRESS, { address: [newAddress] });
      
      return data;
    } catch (error: any) {
        console.log("API Error =>", error.response?.data); // 👈 add this
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

// Async thunk to fetch all addresses
export const getAddress = createAsyncThunk(
  "address/getAddress",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(ENDPOINTS.GET_ADDRESS);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {
    clearAddresses: (state) => {
      state.addresses = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Add Address
    builder
      .addCase(addAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addAddress.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false; 
        const newAddress = action.payload?.data;
        if (Array.isArray(newAddress)) {
          state.addresses.push(...newAddress);
        } else if (newAddress) {
          state.addresses.push(newAddress);
        }})
      .addCase(addAddress.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Get Address
    builder
      .addCase(getAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAddress.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.addresses = action.payload?.data || action.payload || [];
      })
      .addCase(getAddress.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAddresses } = addressSlice.actions;
export default addressSlice.reducer;
