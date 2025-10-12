import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./slices/cartSlice";
import authReducer from "./slices/authSlice";
import toastReducer from "./slices/toastSlice";
import homeReducer from "./slices/homeSlice";
import restaurant from "./slices/restaurantSlice"
export const store = configureStore({
  reducer: {
    toast: toastReducer,
    auth: authReducer, 
    cart: cartReducer, // add more slices here
    home: homeReducer,
    restaurant: restaurant
  },
});

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
