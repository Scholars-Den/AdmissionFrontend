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
                        studentName: data?.studentName || '',
                        Category: data?.Category || '',
                        studentContactNumber: data?.studentContactNumber || '',
                        email: data?.email || '',
                        parentsName: data?.parentsName || '',
                        schoolName: data?.schoolName || '',
                        program: data?.program || '',
                        courseOfIntrested: data?.courseOfIntrested || '',
                        fatherContactNumber: data?.fatherContactNumber || '',
                        fatherName: data?.fatherName || '',
                        fatherOccupations: data?.fatherOccupations || '',
                        city: data?.city || '',
                        state: data?.state || '',
                        knowAboutUs: data?.knowAboutUs || "",
                        remarks: data?.remarks || '',
                        intime: data?.intime || "",
                        enquiryTakenBy: data?.enquiryTakenBy || "",
                        brochureGiven: data?.brochureGiven || ""

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
            const response = await axios.post('/user', formData);

            document.cookie = `token=${response.data.token}`;

            console.log("response from submitsuserDetails", response);


            const data = response.data;

            if (data.length !== 0) {
                return {
                    dataExist: true, // Indicate data exists
                    userData: {
                        studentName: data?.studentName || '',
                        studentContactNumber: data?.studentContactNumber || '',
                        email: data?.email || '',
                        schoolName: data?.schoolName || '',
                        program: data?.program || '',
                        courseOfIntrested: data?.courseOfIntrested || '',
                        fatherContactNumber: data?.fatherContactNumber || '',
                        fatherName: data?.fatherName || '',
                        fatherOccupations: data?.fatherOccupations || '',
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
            const response = await axios.patch('/user/putFormData', formData);

            console.log("response from submitsuserDetails", response);


            const data = response.data;

            if (data.length !== 0) {
                return {
                    dataExist: true, // Indicate data exists
                    userData: {
                        studentName: data?.studentName || '',
                        studentContactNumber: data?.studentContactNumber || '',
                        email: data?.email || '',
                        schoolName: data?.schoolName || '',
                        program: data?.program || '',
                        courseOfIntrested: data?.courseOfIntrested || '',
                        fatherContactNumber: data?.fatherContactNumber || '',
                        fatherName: data?.fatherName || '',
                        fatherOccupations: data?.fatherOccupations || '',
                        city: data?.city || '',
                        state: data?.state || "",
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
