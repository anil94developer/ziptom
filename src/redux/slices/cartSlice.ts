import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ENDPOINTS } from "../../api/endPoint";
import api from "../../api/axiosConfig";

interface CartItem {
    id: string;
    title: string;
    price: number;
    quantity: number;
    image:string
}

interface CartState {
    items: CartItem[];
}

const initialState: CartState = {
    items: [],
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<CartItem>) => {
            const existing = state.items.find((item) => item.id === action.payload.id);
            if (existing) {
                existing.quantity += action.payload.quantity;
            } else {
                state.items.push(action.payload);
            }
        },
        removeFromCart: (state, action: PayloadAction<{ id: string }>) => {
            state.items = state.items.filter((item) => item.id !== action.payload.id);
        },

        updateQuantity: (
            state,
            action: PayloadAction<{ id: string; quantity: number }>
        ) => {
            const item = state.items.find((i) => i.id === action.payload.id);
            if (item) {
                item.quantity = action.payload.quantity;
            }
        },
        clearCart: (state) => {
            state.items = [];
        },
    },
});

export const addCart = createAsyncThunk(
    "cart/addCart",
    async (cartData: { productId: string; quantity: number }, { rejectWithValue }) => {
        try {
            const response = await api.post(ENDPOINTS.ADD_CART, cartData);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || "Something went wrong");
        }
    }
);

export const { addToCart, removeFromCart, updateQuantity, clearCart } =
    cartSlice.actions;

export default cartSlice.reducer;
