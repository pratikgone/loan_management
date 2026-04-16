import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { data } from "react-router-dom";

const BASE_URL = 'https://loan-backend-cv1k.onrender.com/api';

export const fetchLendersWithPlans = createAsyncThunk(
  "lenders/fetchLendersWithPlans",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token || localStorage.getItem('token');
      if (!token) {
        return rejectWithValue('No authentication token');
      }

      const res = await axios.get(`${BASE_URL}/admin/lenders/plans`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.data?.success) {
        throw new Error('API returned unsuccessful');
      }

      const formattedLenders = res.data.data.map(item => ({
        ...item.lender,
        currentPlan: item.currentPlan,
        planPurchaseDetails: item.planPurchaseDetails,
      }));

      return formattedLenders;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || "Failed to fetch lenders data");
    }
  }
);

// Fetching single lender ID wise
export const fetchLenderDetails = createAsyncThunk(
  "lenders/fetchDetails",
  async (lenderId, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token || localStorage.getItem('token');
      if (!token) {
        return rejectWithValue('No authentication token');
      }

      const res = await axios.get(
        `${BASE_URL}/admin/lenders/plans?lenderId=${lenderId}&includeDetails=true`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.data?.success || !res.data?.data?.length) {
        throw new Error('Lender not found or API failed');
      }

      return res.data.data[0];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || "Failed to fetch lender details");
    }
  }
);


//fetched lender id wise borrower

export const fetchBorrowersByLender = createAsyncThunk(
  "lenders/fetchBorrowersByLender",
  async ({ lenderId, page = 1, search = "", status = "" }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token || localStorage.getItem("token");
      const params = new URLSearchParams({ page, limit: 10 });
      if (search) params.append("search", search);
      if (status) params.append("status", status);

      const response = await axios.get(
        `${BASE_URL}/admin/lenders/${lenderId}/borrowers?${params}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch borrowers");
    }
  }
);

// Fetch single borrower details page
export const fetchBorrowerDetails = createAsyncThunk(
  "lenders/fetchBorrowerDetails",
  async (borrowerId, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token || localStorage.getItem('token');
      if (!token) {
        return rejectWithValue('No authentication token');
      }

      const res = await axios.get(
        `${BASE_URL}/admin/borrowers/${borrowerId}/details`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.data?.success) {
        throw new Error('Failed to fetch borrower details');
      }

      return res.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || "Failed to fetch borrower details");
    }
  }
);

// impersonate lender
export const impersonateLender = createAsyncThunk(
  "lenders/impersonateLender",
  async (lenderId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `https://loan-backend-cv1k.onrender.com/api/admin/lenders/${lenderId}/impersonate`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return response.data; // { token, user, lender } 
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Impersonation failed");
    }
  }
);

const initialState = {
  lenders: [],
  selectedLender: null,
  isLoading: false,
  isLoadingDetails: false,  
  error: null,
  lastFetched: null,

  //lender wise borrower fetched state
  lenderBorrowers: null,
  borrowersLoading: false,
  borrowersError: null,

  //borrower wise details fetched state
  selectedBorrower: null,
  borrowerDetailsLoading: false,
  borrowerDetailsError: null,

  //impersonate states
  impersonation: null, // { impersonateToken, lender, adminId, adminName }
  impersonateLoading: false,
  impersonateError: null,
};

const lendersSlice = createSlice({
  name: 'lenders',
  initialState,
  reducers: {
    resetLenders: () => initialState,
    clearSelectedLender: (state) => {
      state.selectedLender = null;
    },
    
    //clear impersonation
     clearImpersonation: (state) => {
    state.impersonation = null;
    state.impersonateError = null;
  }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLendersWithPlans.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLendersWithPlans.fulfilled, (state, action) => {
        state.isLoading = false;
        state.lenders = action.payload;
        state.lastFetched = Date.now();
      })
      .addCase(fetchLendersWithPlans.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Fetch lender details
      .addCase(fetchLenderDetails.pending, (state) => {
        state.isLoadingDetails = true;
        state.error = null;
        state.selectedLender = null;  
      })
      .addCase(fetchLenderDetails.fulfilled, (state, action) => {
        state.isLoadingDetails = false;
        state.selectedLender = action.payload;  
        state.error = null;  
      })
      .addCase(fetchLenderDetails.rejected, (state, action) => {
        state.isLoadingDetails = false;
        state.error = action.payload;
        state.selectedLender = null;  
      })

      //fetched lender wise borrower
      .addCase(fetchBorrowersByLender.pending, (state) => {
        state.borrowersLoading = true;
        state.borrowersError = null;
      })
      .addCase(fetchBorrowersByLender.fulfilled, (state, action) => {
        state.borrowersLoading = false;
        state.lenderBorrowers = action.payload;
      })
      .addCase(fetchBorrowersByLender.rejected, (state, action) => {
        state.borrowersLoading = false;
        state.borrowersError = action.payload;
      })

      //fetched borrower wise details
      .addCase(fetchBorrowerDetails.pending, (state) => {
        state.borrowerDetailsLoading = true;
        state.borrowerDetailsError = null;
      })
      .addCase(fetchBorrowerDetails.fulfilled, (state, action) => {
        state.borrowerDetailsLoading = false;
        state.selectedBorrower = action.payload;
      })
      .addCase(fetchBorrowerDetails.rejected, (state, action) => {
        state.borrowerDetailsLoading = false;
        state.borrowerDetailsError = action.payload;
      })

      //impersonate Lender
      .addCase(impersonateLender.pending, (state) => {
        state.impersonateLoading = true;
        state.impersonateError = null;
      })
      .addCase(impersonateLender.fulfilled, (state, action) => {
        state.impersonateLoading = false;
        state.impersonation = action.payload;
      })
      .addCase(impersonateLender.rejected, (state, action) => {
        state.impersonateLoading = false;
        state.impersonateError = action.payload;
      })

      
  },
});

export const { resetLenders, clearSelectedLender, clearImpersonation } = lendersSlice.actions;
export default lendersSlice.reducer;
