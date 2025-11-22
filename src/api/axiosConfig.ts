import axios from "axios";
import { REACT_APP_API_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { store } from "../redux/store";

const api = axios.create({
  baseURL: "https://ziptom-backend.onrender.com/", // Base URL from .env
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json", 
  }
});

// Optional: Add interceptors for token handling
api.interceptors.request.use(
  async (config) => {
    // Example: attach token from Redux or AsyncStorage
    const token =await AsyncStorage.getItem("token");
    console.log(JSON.stringify(token))
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add vegType from Redux store to headers
    const state = store.getState();
    const vegType = state.home?.vegType;
    if (vegType !== undefined) {
      config.headers.type = vegType ? "veg" : "non-veg";
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
