import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import authService from './authService';
import Cookies from 'js-cookie'
import { toast } from 'sonner';
import axiosInstanceUser from '../../services/axiosInstanceUser';

export  const signupUser = createAsyncThunk(
  'auth/signupUser',
  async (userData, { rejectWithValue }) => {
    try {
      console.log(userData)
      const response = await axios.post('https://vastufy.site/api/users/signup', userData );
      return response.data; 
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const GoogleAuth = createAsyncThunk(
  'auth/GoogleAuth',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post('https://vastufy.site/api/users/googleAuth', userData );
      Cookies.set('token',response.data.response.token)
      Cookies.set('refreshToken',response.data.response.refreshToken)
      
      console.log("Auth Slice",response);
      return response.data; 
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);



export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async(userData, {rejectWithValue}) => {
    try {
      const response = await authService.login(userData)
      console.log("Login Slice response", response);
      
      Cookies.set('token',response.data.response.token)
      Cookies.set('refreshToken',response.data.response.refreshToken);
      return response.data;
    } catch (error) {
      console.log("Login slice error",error);
      return rejectWithValue(error.response ? error.response.data : error.message)
    }
  }
)

export const updateUser = createAsyncThunk(
  'auth/updateUser',
  async ({ userId, name,mobileNumber }, { rejectWithValue }) => {
    try {
      console.log(userId,'fff');
      
      const response = await axiosInstanceUser.put(`/updateuser/${userId}`, { name,mobileNumber  });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);


export const clearUser = createAsyncThunk(
  'auth/clearUser',
  async(_,{dispatch}) => {
    dispatch(logoutUser());
    Cookies.remove('token')
  }
)

export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstanceUser.post('/checkAuth');
      return response.data; 
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);



export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email, { rejectWithValue }) => {
    try {
      const response = await axios.post('https://vastufy.site/api/users/forgot-password', { email });
      toast.success('Password reset link sent');
      return response.data;
    } catch (error) {
      // Handle errors
      toast.error('Failed to send reset link');
      return rejectWithValue(error.response.data);
    }
  }
)


export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ token, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post('https://vastufy.site/api/users/reset-password', {
        token,
        password
      });
      toast.success('Password reset successfully');
      return response.data;
    } catch (error) {
      const message = error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
      toast.error(message || 'Failed to reset password');
      return rejectWithValue(message);
    }
  }
);



const authSlice = createSlice({
  name: 'auth',
  initialState: {
  user: null,
  loading: false,
  error: null,
  },
  reducers: {
    logoutUser(state) {
      state.user = null;
      state.loading = false,
      state.error = null

    },
    clearError(state) {
      state.error = null; 
    }
  },
  extraReducers: (builder) => {
    builder
    .addCase(signupUser.pending,(state)=>{
      state.loading = true;
    })
    .addCase(signupUser.fulfilled,(state,action)=>{
      state.loading = false;
      state.user = action.payload
      console.log(state.user);
      
    })
    .addCase(signupUser.rejected,(state,action)=>{
      state.loading = false;
      state.error = action.payload;
    })
    .addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false;
      console.log("slice login",action);
      state.user = action.payload.response.user; 
    })
    .addCase(loginUser.rejected, (state, action) => {
      console.log("slice login eeree",action);
      state.loading = false;
      state.error = action.payload ? action.payload.message : 'Login failed';
    })
    .addCase(GoogleAuth.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(GoogleAuth.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.response.user;
    })
    .addCase(GoogleAuth.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    .addCase(forgotPassword.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(forgotPassword.fulfilled, (state) => {
      state.loading = false;
    })
    .addCase(forgotPassword.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload ? action.payload.message : 'Login failed';
    })
    .addCase(resetPassword.pending, (state) => {
      state.status = 'loading';
    })
    .addCase(resetPassword.fulfilled, (state) => {
      state.status = 'succeeded';
    })
    .addCase(resetPassword.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    })
    .addCase(updateUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(updateUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
    })
    .addCase(updateUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    
     
  },
});

export const { clearError, logoutUser } = authSlice.actions;
export const selectUser = (state) => state.auth.user
console.log(selectUser,"👍");
export default authSlice.reducer; 
