import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../api/axios";
import { useSelector } from "react-redux";

export const fetchAlreadyExistingStudent = createAsyncThunk(
  "alreadyExistStudent/fetchExistStudent",
  async (_, { rejectWithValue }) => {
    try {
      const alreadyExistStudent = await axios.post(
        "/admissions/getStudentByPhone"
      );

      console.log(
        "AlreadyExistingStudent from fetchExistStduent",
        alreadyExistStudent
      );

      // const alreadyExistStudent = await axios.post(
      //         "/user/getStudentByPhone",
      //         { fatherContactNumber: userData.fatherContactNumber }
      //       );

      console.log("fatherContactNumber", alreadyExistStudent);

      console.log("alreadyExistStudent", alreadyExistStudent.data.data);

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

export const fetchAdmissionApprovalMessage = createAsyncThunk(
  "alreadyExistStudent/fetchAdmissionApprovalMessage",
  async (ackNumber, { rejectWithValue }) => {
    try {
      const checkApproval = await axios.post(
        "/approval/getAdmissionApprovalByAcknowledgementNumber",
        { acknowledgementNumber: ackNumber }
      );

      console.log("checkApproval", checkApproval);

      if (checkApproval) {
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
  },
  reducers: {
    updateAlreadyExistStudent(state, action) {
      state.existingStudent = { ...state.existingStudent, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAlreadyExistingStudent.fulfilled, (state, action) => {
      state.existingStudent = action.payload.existingStudent;
    });
    builder.addCase(fetchAlreadyExistingStudent.rejected, (state) => {
      state.existingStudent = {};
    });
    builder.addCase(fetchAdmissionApprovalMessage.fulfilled, (state, action) => {
      state.studentAdmissionApprovalDetails = action.payload.studentAdmissionApprovalDetails;
    });
    builder.addCase(fetchAdmissionApprovalMessage.rejected, (state) => {
      state.studentAdmissionApprovalDetails = {};
    });
  },
});

export const { updateAlreadyExistStudent } = alreadyExistStudentSlice.actions;
export default alreadyExistStudentSlice.reducer;
