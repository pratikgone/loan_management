import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = 'https://loan-backend-cv1k.onrender.com/api';


//fetch all plan (read/list)
export const fetchPlans = createAsyncThunk(
    "plans/fetchPlans",
    async (_, { getState, rejectWithValue }) => {
        try {

            const token = getState().auth.token || localStorage.getItem('token');
            if (!token) return rejectWithValue('No token found');

            const res = await axios.get(`${BASE_URL}/admin/plans`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.data.data || [];

        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch plans');
        }
    }
)

// Fetch single plan details
export const fetchSinglePlan = createAsyncThunk(
  "plans/fetchSinglePlan",
  async (planId, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token || localStorage.getItem('token');
      if (!token) return rejectWithValue('No token found');

      const res = await axios.get(`${BASE_URL}/admin/plans/${planId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.data; // assume response mein plan object aa raha hai
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch plan details');
    }
  }
);

//create plan

export const createPlan = createAsyncThunk(
    "plans/createPlan",
    async (planData, { getState, rejectWithValue }) => {
        try {
            const token = getState().auth.token || localStorage.getItem('token');
            if (!token) return rejectWithValue('No token found');

            const res = await axios.post(`${BASE_URL}/admin/plans`, planData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            return res.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to create plan")
        }
    }
)

//delete plan
export const deletePlan = createAsyncThunk(
    "plans/deletePlan",
    async (planId, { getState, rejectWithValue }) => {
        try {
            const token = getState().auth.token || localStorage.getItem('token');
            if (!token) return rejectWithValue("No token found");

            console.log("Deleting plan with ID:", planId);
            console.log("API URL:", `${BASE_URL}/admin/plans/${planId}`);

            const res = await axios.delete(`${BASE_URL}/admin/plans/${planId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            console.log("Delete response:", res.data);
            // console.log("Token being sent for delete:", token);

            // Check if deletion was successful from backend
            if (res.data && res.data.success === false) {
                return rejectWithValue(res.data.message || "Backend failed to delete plan");
            }

            //because id wise remove 
            return planId;
        } catch (error) {
            console.error("Delete error details:", error.response || error);
            return rejectWithValue(error.response?.data?.message || error.message || "Failed to delete plan");
        }
    }
)

//update plan (put)

export const updatePlan = createAsyncThunk(
    "plans/updatePlan",
    async ({ planId, updatedData }, { getState, rejectWithValue }) => {
        try {
            const token = getState().auth.token || localStorage.getItem('token');
            if (!token) return rejectWithValue("No token found");

            const res = await axios.put(`${BASE_URL}/admin/plans/${planId}`, updatedData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            return res.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to update plan");
        }
    }
)


const initialState = {
    plans: [],
    isLoading: false,
    isCreating: false,
    isDeleting: false,
    isUpdating: false,
    singlePlan: null,
    isLoadingSingle: false,

    error: null,
    createError: null,
};


const plansSlice = createSlice({

    name: 'plans',
    initialState,
    reducers: {
        clearPlansError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        //fetch plans
        builder
            .addCase(fetchPlans.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchPlans.fulfilled, (state, action) => {
                state.isLoading = false;
                state.plans = action.payload;
            })
            .addCase(fetchPlans.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            //create plans
            .addCase(createPlan.pending, (state) => {
                state.isCreating = true;
                state.error = null;
            })
            .addCase(createPlan.fulfilled, (state, action) => {
                state.isCreating = false;
                state.plans.push(action.payload); // new plan list add
            })
            .addCase(createPlan.rejected, (state, action) => {
                state.isCreating = false;
                 state.createError = action.payload;
            })

            //delete plan
            .addCase(deletePlan.pending, (state) => {
                state.isDeleting = true;
                state.error = null;
            })
            .addCase(deletePlan.fulfilled, (state, action) => {
                state.isDeleting = false;
                state.plans = state.plans.filter(plan => plan._id !== action.payload);
            })
            .addCase(deletePlan.rejected, (state, action) => {
                state.isDeleting = false;
                state.error = action.payload;
            })

            //update plan
            .addCase(updatePlan.pending, (state) => {
                state.isUpdating = true;
                state.error = null;
            })
            .addCase(updatePlan.fulfilled, (state, action) => {
                state.isUpdating = false;
                const index = state.plans.findIndex(p => p._id === action.payload._id);
                if (index !== -1) {
                    state.plans[index] = action.payload;
                }
            })
            .addCase(updatePlan.rejected, (state, action) => {
                state.isUpdating = false;
                state.error = action.payload;
            })

            //fetch single plans
            .addCase(fetchSinglePlan.pending, (state) => {
                state.isLoadingSingle = true;
                state.singlePlan = null;
                state.error = null;
            })
            .addCase(fetchSinglePlan.fulfilled, (state, action) => {
                state.isLoadingSingle = false;
                state.singlePlan = action.payload;
            })
            .addCase(fetchSinglePlan.rejected, (state, action) => {
                state.isLoadingSingle = false;
                state.error = action.payload;
            });
    },
});

export const { clearPlansError } = plansSlice.actions;
export default plansSlice.reducer;