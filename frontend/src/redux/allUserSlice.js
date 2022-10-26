import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import jwt_decode from "jwt-decode";
import axios from 'axios';
const token =localStorage.getItem('Token')
if(token && token !==  null ){
    console.log("token exists")  
    const decoded = jwt_decode(token);
    const expiresIn = new Date(decoded.exp*10000);
    if(new Date() > expiresIn){
      localStorage.removeItem('Token');
    }

}



const initialState = {
  name: 'hassan raza',
  allUserData:"",
  loading: false,
  token:token
}

export const getAllUser = createAsyncThunk('user/getUser', async (values, thunkAPI) => {
  try {  
    const response=await  axios.get(`http://localhost:5001/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
       },
    })
    console.log(response,"responseAll")
    return response.data
  } catch (error) {
    console.log('this is the error: ', { error })
    return thunkAPI.rejectWithValue({
      err: error.response.data.message,
      status: error.response.status
    })
  }
})

const allUserSlice = createSlice({
  name: 'initialReducer',
  initialState,
  reducers: {},
  extraReducers: {
    [getAllUser.pending]: (state, action) => {
       state.loading=false
    },
    [getAllUser.fulfilled]: (state, action) => {
        state.allUserData=action.payload
        state.loading=false
    },
    [getAllUser.rejected]: (state, action) => {
      state.loading=false
    }
  }
});

export default allUserSlice.reducer;

