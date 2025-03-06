import { configureStore } from '@reduxjs/toolkit';
import formDataReducer from "./formDataSlice"
import loadingDetailsReducer from "./loadingSlice"


// Configure Redux Store
const store = configureStore({
  reducer: {
    // Adding each slice to the store
    userDetails: formDataReducer,
    loadingDetails: loadingDetailsReducer
    
  },
});

export default store;
