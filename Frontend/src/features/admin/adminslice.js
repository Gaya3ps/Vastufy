import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Cookies from 'js-cookie';
import adminService from './adminService';
import axiosInstance from '../../services/axiosInstance';

export const loginAdmin = createAsyncThunk(
  'admin/loginAdmin',
  async (adminData, { rejectWithValue }) => {
    try {
      const response = await adminService.adminLogin(adminData);
      console.log("hhhhhhhhhhhhh",response);
      
      Cookies.set('admintoken', response.response.token);
      Cookies.set('adminRefreshtoken', response.response.refreshToken);

      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchUsers = createAsyncThunk('admin/fetchUsers', async () => {
  const response = await axios.get('http://localhost:5000/api/admin/userlist');
  return response.data;
});

export const toggleUserStatus = createAsyncThunk('admin/toggleUserStatus', async ({ userId, isBlocked }) => {
  const response = await axios.post('http://localhost:5000/api/admin/block-user', { userId, is_blocked: isBlocked });
  return response.data;
});

export const clearAdmin = createAsyncThunk(
    'admin/clearAdmin',
    async (_, { dispatch }) => {
      dispatch(logoutAdmin());
      Cookies.remove('admintoken');
    }
  );


  export const addCategory = createAsyncThunk('admin/addCategory', async (categoryData, {rejectWithValue})=>{
try {
  console.log(categoryData,'uuuuuuuuuuuuuuuuuuuu');
  const response = await axios.post('http://localhost:5000/api/admin/add-category', categoryData)
  return response.data;
  
} catch (error) {
  return rejectWithValue(error.response.data)
}
  })

  export const editCategory = createAsyncThunk('admin/editCategory', async (editCategoryData,{rejectWithValue})=>{
    try{
      console.log(editCategoryData,'bbbbbbbbbbbbbbbbbbbb');
      const {id,...data} = editCategoryData;
      
      
    const response = await axios.put(`http://localhost:5000/api/admin/edit-category/${id}`,data )
    return response.data

    }catch (error) {
      return rejectWithValue(error.response.data)
    }
  })

  export const deleteCategory = createAsyncThunk('admin/deleteCategory', async (deleteCategoryData,{rejectWithValue})=>{
    try {
      console.log(deleteCategoryData,'ssssssssssssssssssssss');
      const id = deleteCategoryData;
      console.log(id,"ppppppppppppppppppppppppppp");
      
      const response = await axios.delete(`http://localhost:5000/api/admin/delete-category/${id}`)
      return response.data;
      
    }catch (error) {
      return rejectWithValue(error.response.data)
    }
  })

  export const addSubcategory = createAsyncThunk('admin/addSubcategory', async (subCategoryData,{rejectWithValue}) => {
   try {
    console.log(subCategoryData,'zzzzzzzzzzzzzzzzzzzzzzzzzz');
  const response = await axios.post('http://localhost:5000/api/admin/add-subcategory', subCategoryData)
  return response.data;
    
   } catch (error) {
    return rejectWithValue(error.response.data)
  }
  })

 export const  editSubcategory = createAsyncThunk('admin/editSubcategory', async (editSubcategory,{rejectWithValue}) => {
  try {
    console.log(editSubcategory,'iiiiiiiii');
const {id, ...data} = editSubcategory;

    const response = await axios.put(`http://localhost:5000/api/admin/edit-subcategory/${id}`,data);
    return response.data;
    
  } catch (error) {
    return rejectWithValue(error.response.data)
  }
 })


export const  deleteSubcategory = createAsyncThunk('admin/deleteSubcategory', async(deleteSubcategorydata,{rejectWithValue})=>{
  try {
    console.log(deleteSubcategorydata,'mmmmmmmmmmmmmmmmmm');
    const id = deleteSubcategorydata;
    console.log(id,"cccccccccccccccc");
    
    const response = await axios.delete(`http://localhost:5000/api/admin/delete-subcategory/${id}`)
    return response.data;
    
  }catch (error) {
    return rejectWithValue(error.response.data)
  }
})


export const addSubscriptionPlan = createAsyncThunk(
  'admin/addSubscriptionPlan',
  async (subscriptionData, { rejectWithValue }) => {
    console.log(subscriptionData,"??//??//???");
    try {
      const response = await axiosInstance.post('http://localhost:5000/api/admin/add-subscription-plan', subscriptionData);
      console.log(response,"gggggggggggggggggggggggggggg");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);



const adminSlice = createSlice({
    name: 'admin',
    initialState: {
      admin: [], 
      status: 'idle',
      error: null,
    },
    reducers: {
      logoutAdmin(state) {
        state.admin = null;
        state.loading = false;
        state.error = null;
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(loginAdmin.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(loginAdmin.fulfilled, (state, action) => {
          state.loading = false;
          state.admin = action.payload;
        })
        .addCase(loginAdmin.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
        .addCase(clearAdmin.fulfilled, (state) => {
          state.admin = null;
        })
        .addCase(fetchUsers.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(fetchUsers.fulfilled, (state, action) => {
          state.status = 'succeeded';
          state.admin = action.payload;
        })
        .addCase(fetchUsers.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.error.message;
        })
        .addCase(toggleUserStatus.fulfilled, (state, action) => {
          const index = state.admin.findIndex((admin) => admin._id === action.payload._id);
          if (index !== -1) {
            state.admin[index] = action.payload;
          }
        })
        
    
    },
  });
  
  export const { logoutAdmin } = adminSlice.actions;
  
  export default adminSlice.reducer;