import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../api/axios';




export const fetchUserDetails = createAsyncThunk(
    'userDetails/fetchUserDetails',
    async (_, { rejectWithValue }) => {
        try {
            console.log("token from fetchUserDetailvgwgrs");
            const response = await axios.get('/user/getUserbyToken');


            const data = response.data;

            console.log("data from fetchUserDetails", response.data);
            if (data.length !== 0) {
                return {
                    dataExist: true, // Indicate data exists
                    userData: {
                        studentName: data?.newAdmission?.studentName || '',
                        aadharID: data?.newAdmission?.aadharID || '',
                        studentContactNumber: data?.newAdmission?.studentContactNumber || '',
                        gender: data?.newAdmission?.gender || '',
                        category: data?.newAdmission?.Category || '',
                        dob: data?.newAdmission?.dob || '',
                        bloogGroup: data?.newAdmission?.bloogGroup || '',
                        scholarship: data?.newAdmission?.scholarship || '',


                        fatherName: data?.newAdmission?.fatherName || '',
                        fatherAadharId: data?.newAdmission?.fatherAadharId || '',
                        fatherDob: data?.newAdmission?.fatherDob || '',
                        fatherBloodGroup: data?.newAdmission?.fatherBloodGroup || '',
                        fatherOccupations: data?.newAdmission?.fatherOccupatoions || '',
                        motherName: data?.newAdmission?.motherName || '',
                        motherAadharId: data?.newAdmission?.motherAadharId || '',
                        motherDob: data?.newAdmission?.motherDob || '',
                        motherBloodGroup: data?.newAdmission?.motherBloodGroup || '',
                        motherOccupations: data?.newAdmission?.motherOccupations || '',



                        email: data?.newAdmission?.email || '',
                        parentsName: data?.newAdmission?.parentsName || '',
                        schoolName: data?.newAdmission?.schoolName || '',
                        program: data?.newAdmission?.program || '',
                        courseOfIntrested: data?.newAdmission?.courseOfIntrested || '',
                        fatherContactNumber: data?.newAdmission?.fatherContactNumber || '',
                        city: data?.newAdmission?.city || '',
                        state: data?.newAdmission?.state || '',
                        knowAboutUs: data?.newAdmission?.knowAboutUs || "",
                        remarks: data?.newAdmission?.remarks || '',
                        intime: data?.newAdmission?.intime || "",
                        enquiryTakenBy: data?.newAdmission?.enquiryTakenBy || "",
                        brochureGiven: data?.newAdmission?.brochureGiven || ""

                    },
                };
            } else {
                return {
                    dataExist: false, // Indicate data does not exist
                    formData: {}, // Default empty data
                };
            }
        } catch (error) {
            console.log("error from fetchUserDetails", error);
            return rejectWithValue(error.response?.data || 'Failed to fetch user details');
        }

    }
)

export const submitFormData = createAsyncThunk(
    'userDetails/submitFormData',
    async (formData, { rejectWithValue }) => {
        try {

            console.log("formData from submitFormData", formData);
            const response = await axios.post('/admissions/createAdmission', formData);

            document.cookie = `token=${response.data.token}`;

            console.log("response from submitsuserDetails", response);


            const data = response.data;

            if (data.length !== 0) {
                return {
                    dataExist: true, // Indicate data exists
                    userData: {



                        studentName: data?.newAdmission?.studentName || '',
                        aadharID: data?.newAdmission?.aadharID || '',
                        studentContactNumber: data?.newAdmission?.studentContactNumber || '',
                        gender: data?.newAdmission?.gender || '',
                        category: data?.newAdmission?.Category || '',
                        dob: data?.newAdmission?.dob || '',
                        bloogGroup: data?.newAdmission?.bloogGroup || '',
                        scholarship: data?.newAdmission?.scholarship || '',


                        fatherName: data?.newAdmission?.fatherName || '',
                        fatherAadharId: data?.newAdmission?.fatherAadharId || '',
                        fatherDob: data?.newAdmission?.fatherDob || '',
                        fatherBloodGroup: data?.newAdmission?.fatherBloodGroup || '',
                        fatherOccupations: data?.newAdmission?.fatherOccupatoions || '',
                        motherName: data?.newAdmission?.motherName || '',
                        motherAadharId: data?.newAdmission?.motherAadharId || '',
                        motherDob: data?.newAdmission?.motherDob || '',
                        motherBloodGroup: data?.newAdmission?.motherBloodGroup || '',
                        motherOccupations: data?.newAdmission?.motherOccupations || '',






                        email: data?.newAdmission?.email || '',
                        schoolName: data?.newAdmission?.schoolName || '',
                        program: data?.newAdmission?.program || '',
                        courseOfIntrested: data?.newAdmission?.courseOfIntrested || '',
                        fatherContactNumber: data?.newAdmission?.fatherContactNumber || '',
                     
                        city: data?.newAdmission?.city || '',
                        state: data?.newAdmission?.state || '',
                        knowAboutUs: data?.newAdmission?.knowAboutUs || "",
                        remarks: data?.newAdmission?.remarks || '',
                        intime: data?.newAdmission?.intime || "",
                        enquiryTakenBy: data?.newAdmission?.enquiryTakenBy || "",
                        brochureGiven: data?.newAdmission?.brochureGiven || "",
                        parentsName: data?.newAdmission?.parentsName || "",

                        
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
            return rejectWithValue(error.response?.data || 'Failed to update user details');
        }
    }
);
export const putFormData = createAsyncThunk(
    'userDetails/putFormData',
    async (formData, { rejectWithValue }) => {
        try {
            console.log("formData from submitFormData", formData);
            const response = await axios.patch('/admissions/putFormData', formData);

            console.log("response from submitsuserDetails", response);


            const data = response.data;

            if (data.length !== 0) {
                return {
                    dataExist: true, // Indicate data exists
                    userData: {
                        

                        studentName: data?.studentName || '',
                        aadharID: data?.aadharID || '',
                        studentContactNumber: data?.studentContactNumber || '',

                        gender: data?.gender || '',
                        category: data?.Category || '',
                        dob: data?.dob || '',
                        bloogGroup: data?.bloogGroup || '',
                        scholarship: data?.scholarship || '',


                        fatherName: data?.fatherName || '',
                        fatherAadharId: data?.fatherAadharId || '',
                        fatherDob: data?.fatherDob || '',
                        fatherBloodGroup: data?.fatherBloodGroup || '',
                        fatherOccupations: data?.fatherOccupatoions || '',
                        motherName: data?.motherName || '',
                        motherAadharId: data?.motherAadharId || '',
                        motherDob: data?.motherDob || '',
                        motherBloodGroup: data?.motherBloodGroup || '',
                        motherOccupations: data?.motherOccupations || '',




                        
                        email: data?.email || '',
                        schoolName: data?.schoolName || '',
                        program: data?.program || '',
                        courseOfIntrested: data?.courseOfIntrested || '',
                        fatherContactNumber: data?.fatherContactNumber || '',
                     
                        city: data?.city || '',
                        state: data?.state || '',
                        knowAboutUs: data?.knowAboutUs || "",
                        remarks: data?.remarks || '',
                        intime: data?.intime || "",
                        enquiryTakenBy: data?.enquiryTakenBy || "",
                        brochureGiven: data?.brochureGiven || "",
                        parentsName: data?.parentsName || "",

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

            return rejectWithValue(error.response?.data || 'Failed to update user details');
        }
    }
);



// Slice
const formDataSlice = createSlice({
    name: 'userDetails',
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
            })


    },
});

export const { updateUserDetails } = formDataSlice.actions;
export default formDataSlice.reducer;
