import {createSlice,createAsyncThunk} from "@reduxjs/toolkit"
import jwt_decode from "jwt-decode";
import axios from "axios";
const token = localStorage.getItem('Token');

export const getAllUser=createAsyncThunk('user/getUser',
  async()  => {
    try {
      return axios.get(`http://localhost:5001/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
       },
    }).then(res => (res.data ))
    } catch (error) {
      console.log(error,"error")
    }
  

})

const initialState = {
    loading:false,
    allUserData: "",
    error:"null"
}


const allUserSlice = createSlice({
    name:'user',
    initialState,
    reducers:{
        [getAllUser.pending]:(state,action) => {
          state.loading=true
        },
        [getAllUser.fulfilled]:(state,action)=>{
          state.loading=false
          state.userData=action.payload
          console.log(action,".........action")
        },
        [getAllUser.rejected]:(state,action)=>
        {
          state.loading= false
          state.error = action.payload
        },
        removeAllUser:(state,action)=>
        {
            state.allUserData=null
        }
    }

})

export const {
  removeAllUser,
}=allUserSlice.actions
export default allUserSlice.reducer
