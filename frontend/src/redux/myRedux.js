import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import jwt_decode from "jwt-decode";
import axios from 'axios';
const token =localStorage.getItem('Token')
const user = localStorage.getItem('User')


if(token && token !==  null ){
    console.log("token exists")  
    const decoded = jwt_decode(token);
    const expiresIn = new Date(decoded.exp*10000);
    if(new Date() > expiresIn){
      localStorage.removeItem('Token');
    }

}



const initialState = {
  initialValue: 0,
  name: 'hassan raza',
  userData:"",
  loading: false,
  token:token
}

export const getTasks = createAsyncThunk('user/getUser', async () => {
  try {  
    const response=await  axios.get(`http://localhost:5001/user/getUser/${user}`, {
        headers: {
          Authorization: `Bearer ${token}`,
       },
    })
    console.log(response,"response")
    return response.data
  } catch (error) {
    console.log('this is the error: ', { error })
    return ({
      err: error.response.data.message,
      status: error.response.status
    })
  }
})

const indexReducer = createSlice({
  name: 'initialReducer',
  initialState,
  reducers: {
    increment(state) {
      state.initialValue++
    },
    decrement(state) {
      state.initialValue--;
    }
  },
  extraReducers: {
    [getTasks.pending]: (state, action) => {
       state.loading=false
    },
    [getTasks.fulfilled]: (state, action) => {
        state.userData=action.payload
        state.loading=false
    },
    [getTasks.rejected]: (state, action) => {
      state.loading=false
    }
  }
});


export const { increment, decrement } = indexReducer.actions;
export default indexReducer.reducer;