// src/redux/slices/authSlice.js
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "../../api/axiosConfig";
import { ENDPOINTS } from "../../api/endPoint";

// API call to request OTP
export const sendOtp = createAsyncThunk(
    "auth/sendOtp",
    async (phone, { rejectWithValue }) => {
        try {
            console.log("phone====", ENDPOINTS.LOGIN)
            const { data } = await api.post(ENDPOINTS.LOGIN, { mobileNumber: phone });
            console.log(data)
            return data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to send OTP"
            );
        }
    }
);

// API call to verify OTP
export const verifyOtp = createAsyncThunk(
    "auth/verifyOtp",
    async ({ phone, otp }, { rejectWithValue }) => {
        try {
            const { data } = await api.post(ENDPOINTS.OTP_VERIFY, { mobileNumber: phone, otp });
            console.log(data)
            return data; // token + user
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Invalid OTP"
            );
        }
    }
);

// API call to verify OTP
export const prefernces = createAsyncThunk(
    "auth/prefernces",
    async (body, { rejectWithValue }) => {
        console.log("request====", body)
        try {
            const { data } = await api.post(ENDPOINTS.PREFERENCES, body);
            console.log(data)
            return data; // token + user
        } catch (error) {
            console.error(error)
            return rejectWithValue(
                error.response?.data?.message || "Invalid PREFERENCES"
            );
        }
    }
);

export const profile = createAsyncThunk(
    "auth/profile",
    async (body, { rejectWithValue }) => {
        console.log("Fetching profile from:", ENDPOINTS.PROFILE)
        try {
            const { data } = await api.get(ENDPOINTS.PROFILE);
            console.log("Profile API Response:", data)
            // Handle response structure: { success, status, message, data: { user: {...} } }
            return data;
        } catch (error) {
            console.error("Error fetching profile:", error)
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch profile"
            );
        }
    }
);

export const updateProfile = createAsyncThunk(
    "auth/updateProfile",
    async (body, { rejectWithValue }) => {
        console.log("Updating profile with data:", body);
        console.log("Endpoint:", ENDPOINTS.EDIT_PROFILE);
        try {
            const { data } = await api.put(ENDPOINTS.EDIT_PROFILE, body);
            console.log("Profile update response:", data);
            return data;
        } catch (error) {
            console.error("Error updating profile:", error);
            return rejectWithValue(
                error.response?.data?.message || "Failed to update profile"
            );
        }
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState: {
        loading: false,
        error: null,
        user: null,
        token: null,
        otpSent: false,
        userDetails:{}
    },
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.otpSent = false;
        },
        setOtpSent: (state, action) => {
            state.loading = false;
            state.otpSent = !!action.payload; // use payload boolean
        },
        setUserDetails:(state,action)=>{
            state.userDetails=action.payload
        }

    },
    extraReducers: (builder) => {
        builder
            // sendOtp
            .addCase(sendOtp.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(sendOtp.fulfilled, (state) => {
                state.loading = false;
                state.otpSent = true;
            })
            .addCase(sendOtp.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // verifyOtp
            .addCase(verifyOtp.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(verifyOtp.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
            })
            .addCase(verifyOtp.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // verifyOtp
            .addCase(prefernces.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(prefernces.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(prefernces.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // fetch profile
            .addCase(profile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(profile.fulfilled,  (state, action: PayloadAction<any>) => {
                state.loading = false;
                // Handle response structure: { success, status, message, data: { user: {...} } }
                if (action.payload?.data?.user) {
                    state.userDetails = action.payload.data.user;
                } else if (action.payload?.data) {
                    // Fallback for different response structures
                    state.userDetails = action.payload.data;
                } else {
                    state.userDetails = action.payload;
                }
                console.log("Updated userDetails:", state.userDetails);
              })
            .addCase(profile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // updateProfile
            .addCase(updateProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProfile.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                // Update userDetails if the response contains updated user data
                if (action.payload?.data?.user) {
                    state.userDetails = action.payload.data.user;
                } else if (action.payload?.data) {
                    state.userDetails = { ...state.userDetails, ...action.payload.data };
                }
                console.log("Updated userDetails:", state.userDetails);
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    },
});

export const { logout, setOtpSent,setUserDetails } = authSlice.actions;
export default authSlice.reducer;
