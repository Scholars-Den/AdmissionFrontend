import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../api/axios";

export const sendOtp = createAsyncThunk("admin/sendVerification", async ({ contactNumber }, { rejectWithValue }) => {
  try {
    const response = await axios.post("/admissions/sendVerification", { mobileNumber :contactNumber });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const verifyOtp = createAsyncThunk("admin/verifyOtp", async ({ contactNumber, otp }, { rejectWithValue }) => {
  try {
    const response = await axios.post("/admissions/verifyNumber", { mobileNumber : contactNumber, otp });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

const adminOtpSlice = createSlice({
  name: "adminOtp",
  initialState: {
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(sendOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendOtp.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default adminOtpSlice.reducer;
