import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import vendorService from './vendorService';
import Cookies from 'js-cookie';
import {toast} from 'sonner'

// Vendor signup thunk
export const vendorSignup = createAsyncThunk(
  'vendor/signup',
  async (vendorData, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://localhost:5000/api/vendor/signup', vendorData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);


export const loginVendor = createAsyncThunk(
  'vendor/loginVendor',
  async(vendorData, {rejectWithValue}) => {
      try {
          console.log('vendordataaaaaaaaaaaaaaaaaa here',vendorData);
          const response = await vendorService.loginVendor(vendorData)
          console.log(response.data.response.token,'👿');
          Cookies.set('tokenvendor',response.data.response.token.token)
          return response.data
      } catch (err) {
          if (!err.response) {
            throw err;
          }
          return rejectWithValue(err.response.data);
        }
  }
);

export const clearVendor = createAsyncThunk(
  'vendor/clearVendor',
  async (_, { dispatch }) => {
    dispatch(logoutVendor());
    Cookies.remove('tokenvendor');
  }
);


export const uploadLicense = createAsyncThunk(
  'vendor/uploadLicense',
  async (licenseData, { rejectWithValue }) => {
    try {
      console.log('License Data:', licenseData);
      const response = await vendorService.uploadLicense(licenseData);
      return response.data; 
    } catch (error) {
      console.error('Error uploading license:', error);
      return rejectWithValue(error.response.data); 
    }
  }
);


// Thunk to fetch the uploaded license
export const fetchLicense = createAsyncThunk(
  'vendor/fetchLicense',
  async (id, { rejectWithValue }) => {
    try {
      const response = await vendorService.getLicense(id); 
      console.log(response.data,"licenseeeeeeeeeeeeeeeeeeeee");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// update profile
export const updateVendorProfile = createAsyncThunk(
  'vendor/updateVendorProfile',
  async (vendorData,{rejectWithValue}) => {
  try{
    console.log(vendorData,"qqqqqqqqqqqqqqqqqqqqqqqqq");
    const response = await axios.put(`http://localhost:5000/api/vendor/profile/${vendorData.id}`,vendorData);
    return response.data;
  }  catch (error){
    return rejectWithValue(error.response.data)
  }
  }
)

// addVendor Property
export const addVendorProperty = createAsyncThunk(
  'vendor/addVendorProperty',
  async ({ formDataToSend, vendorId }, { rejectWithValue }) => {
    try {
      for (let pair of formDataToSend.entries()) {
                console.log(`${pair[0]}: ${pair[1]}`);
              }
      const response = await vendorService.addVendorProperty(formDataToSend,vendorId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);



const vendorSlice = createSlice({
  name: 'vendor',
  initialState: {
    vendor: null,
    loading: false,
    error: null,
    licenseUploadSuccess: false,
    license: null,
  },
  reducers: {
    setVendor(state, action) {
        state.vendor = action.payload;
    },
    clearError(state) {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(vendorSignup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(vendorSignup.fulfilled, (state, action) => {
        state.vendor = action.payload.vendor;
        state.loading = false;
      })
      .addCase(vendorSignup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loginVendor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginVendor.fulfilled, (state, action) => {
        state.loading = false;
        // console.log("slice login",action);
        console.log("xxxxxxxxxxxxxxxVendor payload:", action.payload); 
        state.vendor = action.payload.response.vendor; 
        console.log(state,"vendor slice lin2-72");
      })
      .addCase(loginVendor.rejected, (state, action) => {
        console.log("slice login eeree",action);
        state.loading = false;
        state.error = action.payload ? action.payload.error : 'Login failed';
    })
    .addCase(uploadLicense.pending, (state) => {
      state.status = 'loading';
    })
    .addCase(uploadLicense.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.licenseUploadSuccess = true;
    })
    .addCase(uploadLicense.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.error.message;
    })
    .addCase(clearVendor.fulfilled, (state) => {
      state.vendor = null;
    })
    .addCase(fetchLicense.pending, (state) => {
      state.loading = true;
    })
    .addCase(fetchLicense.fulfilled, (state, action) => {
      state.loading = false;
      state.vendor = action.payload;
    })
    .addCase(fetchLicense.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    .addCase(updateVendorProfile.fulfilled, (state, action) => {
      state.vendor = action.payload.updatedVendorProfile;
      state.loading = false;
      toast.success("Profile updated successfully!");
    })
    .addCase(updateVendorProfile.rejected, (state, action) => {
      state.error = action.payload;
    })
    .addCase(addVendorProperty.pending, (state) => {
      state.loading = true;
    })
    .addCase(addVendorProperty.fulfilled, (state, action) => {
      state.loading = false;
      toast.success('Property added successfully!');
    })
    .addCase(addVendorProperty.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      toast.error('Property addition failed!');
    });
  },
});

export const { clearError, setVendor } = vendorSlice.actions;
export const selectVendor = (state) => state.vendor.vendor;

export default vendorSlice.reducer;
