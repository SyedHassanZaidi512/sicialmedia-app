import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import jwt_decode from "jwt-decode";
import axios from 'axios';
const token =localStorage.getItem('Token')
if(token && token !==  null ){ 
    const decoded = jwt_decode(token);
    const expiresIn = new Date(decoded.exp*1000);
    if(new Date() > expiresIn){
      localStorage.removeItem('Token');
    }
}


const initialState = {
  posts:"",
  loading: false,
  token:token
}

export const getPosts = createAsyncThunk('getPost', async (values, thunkAPI) => {
  try {  
    const response=await  axios.get(`http://localhost:5001/post/allPost`, {
        headers: {
          Authorization: `Bearer ${token}`,
       },
    })
    return response.data
  } catch (error) {
    console.log('this is the error: ', { error })
    return thunkAPI.rejectWithValue({
      err: error.response.data.message,
      status: error.response.status
    })
  }
})

const postSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {},
  extraReducers: {
    [getPosts.pending]: (state) => {
       state.loading=false
    },
    [getPosts.fulfilled]: (state, action) => {
        state.posts=action.payload
        state.loading=false
    },
    [getPosts.rejected]: (state) => {
      state.loading=false
    }
  }
});

export default postSlice.reducer;

