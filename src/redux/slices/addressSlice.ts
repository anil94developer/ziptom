import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { ENDPOINTS } from "../../api/endPoint";
import api from "../../api/axiosConfig";

export interface Address {
  id?: string;
  addressId?: string; // For update operations
  label: string;
  address: string;
  city: string;
  country: string;
  landmark?: string;
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
    newAddress: Omit<Address, 'id' | 'addressId'>,
    { rejectWithValue, dispatch }
  ) => {
    try {
      console.log("Adding address to:", ENDPOINTS.ADD_ADDRESS);
      console.log("Address data:", newAddress);
      const { data } = await api.post(ENDPOINTS.ADD_ADDRESS, newAddress);
      console.log("Add address response:", data);
      // Refetch addresses to get updated list
      dispatch(getAddress());
      return data;
    } catch (error: any) {
      console.log("API Error =>", error.response?.data);
      return rejectWithValue(error.response?.data?.message || "Failed to add address");
    }
  }
);

// Async thunk to update an existing address
export const updateAddress = createAsyncThunk(
  "address/updateAddress",
  async (
    addressData: Address,
    { rejectWithValue, dispatch }
  ) => {
    try {
      const { addressId, id, ...updateData } = addressData;
      const finalAddressId = addressId || id;
      
      if (!finalAddressId) {
        return rejectWithValue("Address ID is required for update");
      }
      
      const requestBody = {
        addressId: finalAddressId,
        ...updateData,
      };
      
      console.log("Updating address at:", ENDPOINTS.UPDATE_ADDRESS);
      console.log("Update data:", requestBody);
      const { data } = await api.put(ENDPOINTS.UPDATE_ADDRESS, requestBody);
      console.log("Update address response:", data);
      // Refetch addresses to get updated list
      dispatch(getAddress());
      return data;
    } catch (error: any) {
      console.log("API Error =>", error.response?.data);
      return rejectWithValue(error.response?.data?.message || "Failed to update address");
    }
  }
);

// Async thunk to fetch all addresses
export const getAddress = createAsyncThunk(
  "address/getAddress",
  async (_, { rejectWithValue }) => {
    try {
      console.log("Fetching addresses from:", ENDPOINTS.GET_ADDRESS);
      const response = await api.get(ENDPOINTS.GET_ADDRESS);
      console.log("Get address response:", response.data);
      return response.data;
    } catch (error: any) {
      console.log("API Error =>", error.response?.data);
      return rejectWithValue(error.response?.data?.message || "Failed to fetch addresses");
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
        // Address list will be updated by getAddress after add
        // Just log success
        console.log("Address added successfully");
      })
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
        // Handle response structure: { success, status, message, data: { addresses: [...], count: number } }
        const response = action.payload;
        
        // Helper function to extract address ID from various possible field names
        const getAddressId = (addr: any): string => {
          return addr.id || addr.addressId || addr._id || "";
        };
        
        if (response?.data?.addresses && Array.isArray(response.data.addresses)) {
          // Map addresses to ensure id is set correctly
          state.addresses = response.data.addresses.map((addr: any) => {
            const addressId = getAddressId(addr);
            return {
              id: addressId,
              addressId: addressId,
              label: addr.label || "",
              address: addr.address || "",
              city: addr.city || "",
              country: addr.country || "",
              landmark: addr.landmark || "",
            };
          });
        } else if (Array.isArray(response?.data)) {
          state.addresses = response.data.map((addr: any) => {
            const addressId = getAddressId(addr);
            return {
              id: addressId,
              addressId: addressId,
              label: addr.label || "",
              address: addr.address || "",
              city: addr.city || "",
              country: addr.country || "",
              landmark: addr.landmark || "",
            };
          });
        } else {
          state.addresses = [];
        }
        console.log("Updated addresses in state:", state.addresses);
        console.log("Address IDs:", state.addresses.map(a => ({ id: a.id, addressId: a.addressId })));
      })
      .addCase(getAddress.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update Address
    builder
      .addCase(updateAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAddress.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        // Address list will be updated by getAddress after update
        // Just log success
        console.log("Address updated successfully");
      })
      .addCase(updateAddress.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAddresses } = addressSlice.actions;
export default addressSlice.reducer;
