import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import jwt_decode from "jwt-decode";
import axios from 'axios';
const token =localStorage.getItem('Token')

if(token && token !==  null ){
    const decoded = jwt_decode(token);
    const expiresIn = new Date(decoded.exp*10000);
    if(new Date() > expiresIn){
      localStorage.removeItem('Token');
    }

}

const initialState = {
  userData:"",
  loading: false,
  token:token
}

export const getData = createAsyncThunk('user/getUser', async (id,values, thunkAPI) => {
  try {  
    const response=await  axios.get(`http://localhost:5001/user/getUser/${id}`, {
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

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: {
    [getData.pending]: (state, action) => {
       state.loading=false
    },
    [getData.fulfilled]: (state, action) => {
        state.userData=action.payload
        state.loading=false
    },
    [getData.rejected]: (state, action) => {
      state.loading=false
    }
  }
});


// export const { increment, decrement } = indexReducer.actions;
export default userSlice.reducer;

