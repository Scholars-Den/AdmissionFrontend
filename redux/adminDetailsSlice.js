import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../api/axios";
import { useSelector } from "react-redux";

export const fetchAdminDetails = createAsyncThunk(
  "adminDetails/fetchAdminDetails",
  async (_, { rejectWithValue }) => {
    try {
      const alreadyExistStudent = await axios.post("/user/getStudentByPhone", {
        fatherContactNumber,
      });

      // const alreadyExistStudent = await axios.post(
      //         "/user/getStudentByPhone",
      //         { fatherContactNumber: userData.fatherContactNumber }
      //       );

      console.log("fatherContactNumber", alreadyExistStudent);

      if (alreadyExistStudent) {
        return {
          existingStudent: alreadyExistStudent.data.data,
        };
      } else {
        return {
          existingStudent: {},
        };
      }
    } catch (error) {
      console.log("Error from fetchUserDetails", error);
      return rejectWithValue(
        error.response?.data || "Failed to fetch user details"
      );
    }
  }
);

export const submitAdminDetails = createAsyncThunk(
  "adminDetails/submitAdminDetails",
  async (adminDetails, { rejectWithValue }) => {
    try {
      console.log("adminDetails", adminDetails);

      const adminLogin = await axios.post("/admin/login", {
        adminDetails,
      });

      // const alreadyExistStudent = await axios.post(
      //         "/user/getStudentByPhone",
      //         { fatherContactNumber: userData.fatherContactNumber }
      //       );



      console.log("adminLogin", adminLogin);
document.cookie = `token=${adminLogin.data.token}; path=/; secure; samesite=strict`;

      if (adminLogin) {
        return {
          existingStudent: adminLogin.data.data,
        };
      } else {
        return {
          existingStudent: {},
        };
      }
    } catch (error) {
      console.log("Error from fetchUserDetails", error);
      return rejectWithValue(
        error.response?.data || "Failed to fetch user details"
      );
    }
  }
);

// Slice definition
const adminDetails = createSlice({
  name: "adminDetails",
  initialState: {
    adminDetails: {},
  },
  reducers: {
    updateAdminDetails(state, action) {
      state.adminDetails = { ...state.adminDetails, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAdminDetails.fulfilled, (state, action) => {
      state.adminDetails = action.payload.adminDetails;
    });
    builder.addCase(fetchAdminDetails.rejected, (state) => {
      state.adminDetails = {};
    });
  },
});

export const { updateAdminDetails } = adminDetails.actions;
export default adminDetails.reducer;
