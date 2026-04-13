// src/features/dashboard/dashboardSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = 'https://loan-backend-cv1k.onrender.com/api';

export const fetchRevenue = createAsyncThunk(
  'dashboard/fetchRevenue',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token || localStorage.getItem('token');
      if (!token) {
        return rejectWithValue('No authentication token');
      }

      const res = await axios.get(`${BASE_URL}/admin/revenue?groupBy=all`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.data?.success) {
        throw new Error('API returned unsuccessful');
      }

      return res.data.data.summary;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to fetch revenue');
    }
  }
);

export const fetchRecentActivities = createAsyncThunk(
  'dashboard/fetchRecentActivities',
  async (limit = 10, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token || localStorage.getItem('token');
      if (!token) {
        return rejectWithValue('No authentication token');
      }

      const res = await axios.get(
        `${BASE_URL}/admin/recent-activities?limit=${limit}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (!res.data?.success) {
        throw new Error('API returned unsuccessful');
      }

      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || 'Failed to fetch activities'
      );
    }
  }
);


//lender dashboard stats
// Lender dashboard stats
export const fetchLenderStats = createAsyncThunk(
  'dashboard/fetchLenderStats',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token') || getState().auth.token;
      const res = await axios.get(`${BASE_URL}/lender/loans/statistics`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed');
    }
  }
);


// Lender recent activities
export const fetchLenderActivities = createAsyncThunk(
  'dashboard/fetchLenderActivities',
  async (limit = 5, { getState, rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token') || getState().auth.token;
      const res = await axios.get(
        `${BASE_URL}/lender/loans/recent-activities?limit=${limit}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed');
    }
  }
);



const initialState = {
  revenue: null,
  dashboardActivities: [], //5
  allActivities: [], //10
  isLoading: false,
  error: null,
  lastFetched: null,

  //lenders states
  lenderStats: null,
lenderActivities: [],
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    resetDashboard: () => initialState
  },
  extraReducers: (builder) => {
    builder
      // Revenue
      .addCase(fetchRevenue.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRevenue.fulfilled, (state, action) => {
        state.isLoading = false;
        state.revenue = action.payload;
        state.lastFetched = Date.now();
      })
      .addCase(fetchRevenue.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Activities
      .addCase(fetchRecentActivities.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchRecentActivities.fulfilled, (state, action) => {
        state.isLoading = false;

        const limit = action.meta.arg;
        if(limit === 5) {
          state.dashboardActivities = action.payload;
        }else{
          state.allActivities = action.payload;
        }
    
      })
      .addCase(fetchRecentActivities.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      //lenders adcases
      .addCase(fetchLenderStats.fulfilled, (state, action) => {
  state.isLoading = false;
  state.lenderStats = action.payload;
  state.lastFetched = Date.now();
})
.addCase(fetchLenderActivities.fulfilled, (state, action) => {
  state.isLoading = false;
  state.lenderActivities = action.payload;
})
  }
});

export const { resetDashboard } = dashboardSlice.actions;
export default dashboardSlice.reducer;