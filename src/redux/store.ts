import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./slices/cartSlice";
import authReducer from "./slices/authSlice";
import toastReducer from "./slices/toastSlice";
import homeReducer from "./slices/homeSlice";
import restaurant from "./slices/restaurantSlice"
import address from "./slices/addressSlice"
import order from "./slices/orderSlice"
import coupon from "./slices/couponsSlice"
import restaurants from "./slices/restaurantSlice"
export const store = configureStore({
  reducer: {
    toast: toastReducer,
    auth: authReducer, 
    cart: cartReducer, // add more slices here
    home: homeReducer,
    restaurant: restaurant,
    address: address, 
    order:order,
    coupon:coupon,
    restaurants:restaurants
  },
});

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
