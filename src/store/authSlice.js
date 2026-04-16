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

        //impersonate state
        isImpersonating: false,
        originalToken: null,
        originalUser: null,
        adminId: null,
        adminName: null,
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
        },
   
// authSlice.js
startImpersonation: (state, action) => {
  const payload = action.payload;           
  const data = payload.data || payload;     

  // Original admin state save karo
//   if (!state.originalToken) {
//     state.originalToken = state.token;
//     state.originalUser = state.user ? { ...state.user } : null;
//   }
if (!state.originalToken) {
  state.originalToken = state.token;
  state.originalUser = state.user ? { ...state.user } : null;

  localStorage.setItem("originalToken", state.token || "");
  localStorage.setItem("originalUser", JSON.stringify(state.user || {}));
}

  //  token with user set 
  state.token = data.impersonateToken || data.token;
  state.user = data.lender || data.user || data;   // lender object

  state.isImpersonating = true;
  state.impersonatedLenderId = data.lender?._id || null;

  // LocalStorage save 
  if (state.token) localStorage.setItem("token", state.token);
  if (state.user) localStorage.setItem("user", JSON.stringify(state.user));
  localStorage.setItem("isImpersonating", "true");

  console.log(" Final Impersonation State - User:", state.user);
},
//    stopImpersonation: (state) => {
//   // Original Admin ka data restore karo
//   if (state.originalToken && state.originalUser) {
//     state.token = state.originalToken;
//     state.user = state.originalUser;
//   }

//   // Impersonation 
//   state.isImpersonating = false;
//   state.impersonatedLenderId = null;

//   
//   // state.originalToken = null;     
//   // state.originalUser = null;      

//   // LocalStorage update
//   if (state.token) {
//     localStorage.setItem("token", state.token);
//   }
//   if (state.user) {
//     localStorage.setItem("user", JSON.stringify(state.user));
//   }

//   localStorage.removeItem("isImpersonating");

//   console.log("✅ Impersonation Stopped - Back to Admin");
// },
stopImpersonation: (state) => {
  // Original Admin data restore 
  if (state.originalToken && state.originalUser) {
    state.token = state.originalToken;
    state.user = state.originalUser;
  }

  state.isImpersonating = false;
  state.impersonatedLenderId = null;

  // Clear temporary impersonation data
  state.originalToken = null;
  state.originalUser = null;

  // LocalStorage update
  if (state.token) {
    localStorage.setItem("token", state.token);
  }
  if (state.user) {
    localStorage.setItem("user", JSON.stringify(state.user));
  }

  localStorage.removeItem("isImpersonating");
  localStorage.removeItem("originalToken");
  localStorage.removeItem("originalUser");

  console.log(" Impersonation Stopped - Back to Admin. Clean state restored.");
},
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

export const { logout, clearError, startImpersonation, stopImpersonation } = authSlice.actions;
export default authSlice.reducer;