import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../api/axios";
import { useSelector } from "react-redux";

export const fetchAlreadyExistingStudent = createAsyncThunk(
  "alreadyExistStudent/fetchExistStudent",
  async (fatherContactNumber, { rejectWithValue }) => {
    try {
      console.log("FatherContactNuber", fatherContactNumber);
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

// Slice definition
const alreadyExistStudentSlice = createSlice({
  name: "alreadyExistStudent",
  initialState: {
    existingStudent: {},
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
  },
});

export const { updateAlreadyExistStudent } = alreadyExistStudentSlice.actions;
export default alreadyExistStudentSlice.reducer;
