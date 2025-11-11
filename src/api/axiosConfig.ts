import axios from "axios";
import { REACT_APP_API_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";

const api = axios.create({
  baseURL: REACT_APP_API_URL, // Base URL from .env
  headers: {
    "Content-Type": "application/json",
  }
});

// Optional: Add interceptors for token handling
api.interceptors.request.use(
  async (config) => {
    // Example: attach token from Redux or AsyncStorage
    const token =await AsyncStorage.getItem("token");
    // console.log(JSON.stringify(token))
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
