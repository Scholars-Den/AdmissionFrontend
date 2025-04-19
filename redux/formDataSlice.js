import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../api/axios";
import TermsAndConditionPage from "../src/Components/TermsAndConditionPage";

export const fetchUserDetails = createAsyncThunk(
  "userDetails/fetchUserDetails",
  async (_, { rejectWithValue }) => {
    try {
      console.log("Fetching user details...");
      const response = await axios.get("/admissions/getUserbyToken");

      const data = response.data;

      console.log("Fetched user data from fetchDetails function:", data);
      if (data) {
        // Ensure siblings array always has a length of 4
        // const siblings = data?.siblings || [];
        // const filledSiblings = [
        //   ...siblings,
        //   ...Array(4 - siblings.length).fill({}),
        // ];

        return {
          dataExist: true, // Data exists
          userData: {
            parentsContactNumber: data?.parentsContactNumber || "",
            studentName: data?.studentName || "",
            admissionRollNo: data?.admissionRollNo || "",
            enrollmentNumber: data?.enrollmentNumber || "",

            aadharID: data?.aadharID || "",
            studentContactNumber: data?.studentContactNumber || "",
            gender: data?.gender || "",
            category: data?.category || "",
            studentClass: data?.studentClass || "",
            program: data?.program || "",
            dob: data?.dob || "",
            bloogGroup: data?.bloogGroup || "",
            scholarship: data?.scholarship || "",
            termsAndCondition: data?.TermsAndCondition || "",
            fatherName: data?.fatherName || "",
            fatherAadharId: data?.fatherAadharId || "",
            fatherDob: data?.fatherDob || "",
            fatherBloodGroup: data?.fatherBloodGroup || "",
            fatherOccupations: data?.fatherOccupations || "",
            motherName: data?.motherName || "",
            motherAadharId: data?.motherAadharId || "",
            motherDob: data?.motherDob || "",
            motherBloodGroup: data?.motherBloodGroup || "",
            motherOccupations: data?.motherOccupations || "",
            siblings: data?.siblings || "", 
            signatures: data?.signatures || {},
            noOfBrother: data?.noOfBrother || 0,
            noOfSister: data?.noOfSister || 0,
            siblingsPosition: data?.siblingsPosition || 0,

            accountHolder: data?.accountHolder || "",
            bankName: data?.bankName || "",
            accountNumber: data?.accountNumber || "",
            ifscCode: data?.ifscCode || "",
            relationWithStudent: data?.relationWithStudent || "",
            cancelledCheque: data?.cancelledCheque || "",
            passbook: data?.passbook || "",
            studentAadhar: data?.studentAadhar || "",
            parentAadhar: data?.parentAadhar || "",
            passportPhotos: data?.passportPhotos || "",
            admissionOfficer: data?.admissionOfficer || "",
            parent: data?.parent || "",

            studentPhoto: data?.studentPhoto || "",

            documents: {
              cancelledCheque: data?.documents?.cancelledCheque || "",
              passbook: data?.documents?.passbook || "",
              studentAadhar: data?.documents?.studentAadhar || "",
              parentAadhar: data?.documents?.parentAadhar || "",
              passportPhotos: data?.documents?.passportPhotos || "",
            },
          },
        };
      } else {
        return {
          dataExist: false,
          formData: {},
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

export const submitBankRefundForm = createAsyncThunk(
  "userDetails/submitBankRefundForm",
  async (formData, { rejectWithValue }) => {
    try {
      console.log("formData from submitBankRefundForm", formData);
      const response = await axios.patch(
        "/admissions/submitBankRefundForm",
        formData
      );
      console.log("response from submitBankRefundForm", response);

      const data = response.data;
      if (data.length !== 0) {
        return {
          dataExist: true, // Indicate data exists
          userData: {
            accountHolder: data?.accountHolder || "",
            admissionRollNo: data?.admissionRollNo || "",
            enrollmentNumber: data?.enrollmentNumber || "",
            studentClass: data?.studentClass || "",
            program: data?.program || "",
            bankName: data?.bankName || "",
            accountNumber: data?.accountNumber || "",
            ifscCode: data?.ifscCode || "",
            relationWithStudent: data?.relationWithStudent || "",
            documents: {
              cancelledCheque: data?.documents?.cancelledCheque || "",
              passbook: data?.documents?.passbook || "",
              studentAadhar: data?.documents?.studentAadhar || "",
              parentAadhar: data?.documents?.parentAadhar || "",
              passportPhotos: data?.documents?.passportPhotos || "",
            },
            signatures: {
              admissionOfficer: data?.accountNumber || "",
              parent: data?.accountNumber || "",
            },
          },
        };
      }
    } catch (error) {
      console.log("error ", error);
    }
  }
);

export const submitFormData = createAsyncThunk(
  "userDetails/submitFormData",
  async (formData, { rejectWithValue }) => {
    try {
      console.log("formData from submitFormData", formData);
      const response = await axios.post(
        "/admissions/createAdmission",
        formData
      );

      document.cookie = `token=${response.data.token}`;

      console.log("response from submitsuserDetails", response);

      const data = response.data;

      if (data.length !== 0) {
        return {
          dataExist: true, // Indicate data exists
          userData: {
            studentName: data?.newAdmission?.studentName || "",
            aadharID: data?.newAdmission?.aadharID || "",
            studentContactNumber:
              data?.newAdmission?.studentContactNumber || "",
            gender: data?.newAdmission?.gender || "",
            category: data?.newAdmission?.Category || "",
            dob: data?.newAdmission?.dob || "",
            bloogGroup: data?.newAdmission?.bloogGroup || "",
            scholarship: data?.newAdmission?.scholarship || "",
            termsAndCondition: data?.TermsAndCondition || "",
            studentClass: data?.newAdmission?.studentClass || "",
            program: data?.newAdmission?.program || "",

            fatherName: data?.newAdmission?.fatherName || "",
            fatherAadharId: data?.newAdmission?.fatherAadharId || "",
            fatherDob: data?.newAdmission?.fatherDob || "",
            fatherBloodGroup: data?.newAdmission?.fatherBloodGroup || "",
            fatherOccupations: data?.newAdmission?.fatherOccupatoions || "",
            motherName: data?.newAdmission?.motherName || "",
            motherAadharId: data?.newAdmission?.motherAadharId || "",
            motherDob: data?.newAdmission?.motherDob || "",
            motherBloodGroup: data?.newAdmission?.motherBloodGroup || "",
            motherOccupations: data?.newAdmission?.motherOccupations || "",



            cancelledCheque: data?.cancelledCheque || "",
            passbook: data?.passbook || "",
            studentAadhar: data?.studentAadhar || "",
            parentAadhar: data?.parentAadhar || "",
            passportPhotos: data?.passportPhotos || "",
          
          },
        };
      } else {
        return {
          dataExist: false, // Indicate no data exists
          formData: {}, // Default empty data
        };
      }
    } catch (error) {
      console.log("error from submitFormData", error);
      // window.location.reload();
      return rejectWithValue(
        error.response?.data || "Failed to update user details"
      );
    }
  }
);
export const putFormData = createAsyncThunk(
  "userDetails/putFormData",
  async (formData, { rejectWithValue }) => {
    console.log("formData from submitFormData", formData);
    try {
      console.log("formData from submitFormData", formData);
      const response = await axios.patch("/admissions/putFormData", formData);

      console.log("response from submitsuserDetails", response);

      const data = response.data;

      if (data.length !== 0) {
        return {
          dataExist: true, // Indicate data exists
          userData: {
            studentName: data?.studentName || "",
            aadharID: data?.aadharID || "",
            studentContactNumber: data?.studentContactNumber || "",

            gender: data?.gender || "",
            category: data?.Category || "",
            dob: data?.dob || "",
            bloogGroup: data?.bloogGroup || "",
            scholarship: data?.scholarship || "",
            termsAndCondition: data?.TermsAndCondition || "",

            fatherName: data?.fatherName || "",
            fatherAadharId: data?.fatherAadharId || "",
            fatherDob: data?.fatherDob || "",
            fatherBloodGroup: data?.fatherBloodGroup || "",
            fatherOccupations: data?.fatherOccupatoions || "",
            motherName: data?.motherName || "",
            motherAadharId: data?.motherAadharId || "",
            motherDob: data?.motherDob || "",
            motherBloodGroup: data?.motherBloodGroup || "",
            motherOccupations: data?.motherOccupations || "",
            studentPhoto : data?.newAdmission?.studentPhoto || "",


            cancelledCheque: data?.cancelledCheque || "",
            passbook: data?.passbook || "",
            studentAadhar: data?.studentAadhar || "",
            parentAadhar: data?.parentAadhar || "",
            passportPhotos: data?.passportPhotos || "",
          },
        };
      } else {
        return {
          dataExist: false, // Indicate no data exists
          formData: {}, // Default empty data
        };
      }
    } catch (error) {
      console.log("error from submitFormData", error);

      return rejectWithValue(
        error.response?.data || "Failed to update user details"
      );
    }
  }
);

export const submitSiblingsDetails = createAsyncThunk(
  "form/submitSiblingsDetails",
  async (formData, { rejectWithValue }) => {
    console.log("formData from submitSiblingsDetails", formData);
    try {
      const response = await axios.patch(
        `/admissions/submitSiblingsDetails`,
        formData
      );

      console.log("response from submitSiblingsDetails", response);
      return response.data;
    } catch (error) {
      console.log("error form submitSiblingsDetails", error);
      return rejectWithValue(error.response.data);
    }
  }
);

// Slice
const formDataSlice = createSlice({
  name: "userDetails",
  initialState: {
    userData: {},
    loading: false,
    userDataError: null,
    dataExist: false, // New flag to indicate if data exists in the database
  },
  reducers: {
    updateUserDetails(state, action) {
      state.userData = { ...state.userData, ...action.payload };
    },

    updateSiblingDetails: (state, action) => {
      const { index, name, value } = action.payload;
      state.userData.siblings[index] = {
        ...state.userData.siblings[index],
        [name]: value,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitFormData.pending, (state) => {
        state.loading = true;
        state.userDataError = null;
      })
      .addCase(submitFormData.fulfilled, (state, action) => {
        state.loading = false;
        state.userData = action.payload.userData;
        state.dataExist = action.payload.dataExist; // Update `dataExist`
      })
      .addCase(submitFormData.rejected, (state, action) => {
        state.loading = false;
        state.userData = {};
        state.userDataError = action.payload;
      })
      .addCase(fetchUserDetails.pending, (state) => {
        state.loading = true;
        state.userDataError = null;
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.userData = action.payload.userData;
        state.dataExist = action.payload.dataExist; // Update `dataExist`
      })
      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.loading = false;
        state.userDataError = action.payload;
      });
  },
});

export const { updateUserDetails, updateSiblingDetails } =
  formDataSlice.actions;
export default formDataSlice.reducer;
