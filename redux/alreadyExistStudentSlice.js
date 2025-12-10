import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../api/axios";

export const fetchAlreadyExistingStudent = createAsyncThunk(
  "alreadyExistStudent/fetchExistStudent",
  async (studentContactNumber, { rejectWithValue }) => {
    try {
      console.log("Fetching student with number:", studentContactNumber);
      
      // FIXED: Send as JSON object with proper key
      const alreadyExistStudent = await axios.post(
        "/admissions/getStudentByPhone",
        { fatherContactNumber: studentContactNumber }  // Send as object
      );

      console.log(
        "AlreadyExistingStudent from fetchExistStudent",
        alreadyExistStudent
      );

      console.log("fatherContactNumber", studentContactNumber);
      console.log("alreadyExistStudent", alreadyExistStudent.data.data);

      if (alreadyExistStudent && alreadyExistStudent.data.data) {
        return {
          existingStudent: alreadyExistStudent.data.data,
        };
      } else {
        return {
          existingStudent: [],
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

export const fetchAdmissionApprovalMessage = createAsyncThunk(
  "alreadyExistStudent/fetchAdmissionApprovalMessage",
  async (ackNumber, { rejectWithValue }) => {
    try {
      console.log("ackNumber", ackNumber);
      const checkApproval = await axios.post(
        "/approval/getAdmissionApprovalByAcknowledgementNumber",
        { acknowledgementNumber: ackNumber }
      );

      console.log("checkApproval", checkApproval);

      if (checkApproval && checkApproval.data.data) {
        return {
          studentAdmissionApprovalDetails: checkApproval.data.data,
        };
      } else {
        return {
          studentAdmissionApprovalDetails: {},
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
const alreadyExistStudentSlice = createSlice({
  name: "alreadyExistStudent",
  initialState: {
    existingStudent: [],
    studentAdmissionApprovalDetails: {},
    loading: false,
    error: null,
  },
  reducers: {
    updateAlreadyExistStudent(state, action) {
      // Handle both array and object updates
      if (Array.isArray(action.payload)) {
        state.existingStudent = action.payload;
      } else {
        state.existingStudent = { ...state.existingStudent, ...action.payload };
      }
    },
    clearExistingStudent(state) {
      state.existingStudent = [];
      state.studentAdmissionApprovalDetails = {};
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch existing student cases
      .addCase(fetchAlreadyExistingStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAlreadyExistingStudent.fulfilled, (state, action) => {
        state.loading = false;
        state.existingStudent = action.payload.existingStudent || [];
        state.error = null;
      })
      .addCase(fetchAlreadyExistingStudent.rejected, (state, action) => {
        state.loading = false;
        state.existingStudent = [];
        state.error = action.payload;
      })
      // Fetch admission approval cases
      .addCase(fetchAdmissionApprovalMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdmissionApprovalMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.studentAdmissionApprovalDetails =
          action.payload.studentAdmissionApprovalDetails || {};
        state.error = null;
      })
      .addCase(fetchAdmissionApprovalMessage.rejected, (state, action) => {
        state.loading = false;
        state.studentAdmissionApprovalDetails = {};
        state.error = action.payload;
      });
  },
});

export const { updateAlreadyExistStudent, clearExistingStudent } =
  alreadyExistStudentSlice.actions;
export default alreadyExistStudentSlice.reducer;