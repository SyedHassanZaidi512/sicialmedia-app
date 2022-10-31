import {createSlice,createAsyncThunk} from "@reduxjs/toolkit"
import jwt_decode from "jwt-decode";
import axios from "axios";
const token = localStorage.getItem('Token');
const user  = localStorage.getItem('User')


 const initialState = {

    users:"",
    error:"null",
    token:""
}

 if(token && token !==  null ){
  const decoded = jwt_decode(token);
  const expiresIn = new Date(decoded.exp*1000);
  if(new Date() > expiresIn){
    localStorage.removeItem('Token');
    localStorage.removeItem('checked')
  }else{
    initialState.token = token;
    const {user} = decoded
    initialState.users = user;
  }
}

export const userSlice = createSlice({
    name:'user',
    initialState,
    reducers:{
        userCredentials:(state,action)=>{
            state.token=token
            state.users=user
        },
        logOut:(state)=>
        {
            state.token=null
            state.users=null
        }
    }

})

export const {
  userCredentials,
  logOut,
}=userSlice.actions
export default userSlice.reducer
