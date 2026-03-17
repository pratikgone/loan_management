import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";


const BASE_URL = 'https://loan-backend-cv1k.onrender.com/api';

//login thunk
export const login = createAsyncThunk(
    "auth/login",
    async ({ mobile, password }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${BASE_URL}/auth/signin`, {
                emailOrMobile: mobile,
                password,
            })
            return response.data; //token user details
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "login failed");
        }
    }
)

//signip thunk (multipart form)

export const signup = createAsyncThunk(
    "auth/signup",
    async (formData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${BASE_URL}/auth/signup`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return response.data; //message user token
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "signup failed");
        }
    }
)


// changePassword thunk
export const changePassword = createAsyncThunk(
    "auth/changePassword",
    async ({ currentPassword, newPassword, confirmNewPassword }, { getState, rejectWithValue }) => {
        try {
            const token = getState().auth.token || localStorage.getItem("token");
            if (!token) return rejectWithValue("No token found");

            const response = await axios.post(
                `${BASE_URL}/user/change-password`,
                { currentPassword, newPassword, confirmNewPassword },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to change password"
            );
        }
    }
);

//update profile

export const updateProfile = createAsyncThunk(
    "auth/updateProfile",
    async (payload, { getState, rejectWithValue }) => {
        try {
            const token = getState().auth.token || localStorage.getItem("token");
            if (!token) return rejectWithValue("No token found");

            const response = await axios.patch(
                `${BASE_URL}/user/update-profile`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
            const updatedUser = { ...currentUser, ...response.data.user };

            localStorage.setItem("user", JSON.stringify(updatedUser));

            return response.data.user;

        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to update profile"
            );
        }
    }
);



// Helper to get initial state from localStorage
const getInitialAuthState = () => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    let user = null;
    if (userStr) {
        try {
            const parsed = JSON.parse(userStr);
            // Handle both formats: full response with .user property or direct user object
            user = parsed.user || parsed;
        } catch (e) {
            user = null;
        }
    }

    return {
        user,
        token,
        isLoading: false,
        error: null,
    };
};

const authSlice = createSlice({
    name: "auth",
    initialState: getInitialAuthState(),
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            localStorage.removeItem("token");
            localStorage.removeItem("user");
        },
         clearError: (state) => {
    state.error = null;
  }
    },
    extraReducers: (builder) => {
        //login
        builder
            .addCase(login.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user || action.payload;
                state.token = action.payload.token;
                localStorage.setItem("token", action.payload.token);
                localStorage.setItem("user", JSON.stringify(action.payload));
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });

        //signup
        builder
            .addCase(signup.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(signup.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                localStorage.setItem("token", action.payload.token);
                localStorage.setItem("user", JSON.stringify(action.payload.user));
            })
            .addCase(signup.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            //change password
            .addCase(changePassword.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(changePassword.fulfilled, (state) => {
                state.isLoading = false;
                state.successMessage = "Password changed successfully!";
            })
            .addCase(changePassword.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            //update profile
            .addCase(updateProfile.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.isLoading = false;

                // merge old user data with updated data
                state.user = {
                    ...state.user,
                    ...action.payload,
                };
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
    }
})

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;