import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";



// Slice definition
const loadingDetailsSlice = createSlice({
  name: "loadingDetails",
  initialState: {
    loading: false,
    error: null,
  },
  reducers: {
    setLoading: (state, action) => {
        state.loading = action.payload;
      },
  },
 
});

export const { setLoading } = loadingDetailsSlice.actions;
export default loadingDetailsSlice.reducer;
